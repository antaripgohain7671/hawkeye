#define CAMERA_MODEL_AI_THINKER       // Camera pin config defined in camera_pins.h

#include "WiFi.h"
#include "esp_camera.h"
#include "camera_pins.h"
#include "base64.h"

#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#define WIDTH 320                     // Captured picture width in pixels
#define HEIGHT 240                    // Captured picture height in pixels
#define BLOCK_SIZE 10                 // How many pixels consists of a block
#define W (WIDTH / BLOCK_SIZE)        // Width in terms in blocks
#define H (HEIGHT / BLOCK_SIZE)       // Height in terms in blocks
#define BLOCK_DIFF_THRESHOLD 0.2      // Percent threshold above which we can say the block actually changed
#define IMAGE_DIFF_THRESHOLD 0.3      // No of blocks changed that can be considered motion
#define DEBUG 0                       // Executes the debug code if set to true, prints frames to serial monitor

bool isLiveStreaming = false;         // Flag for whether to live stream or motion detect

uint16_t prev_frame[H][W] = { 0 };
uint16_t current_frame[H][W] = { 0 };

bool setup_camera();
bool capture_still();
bool motion_detect();
void update_frame();
void print_frame(uint16_t frame[H][W]);

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length);
void live_stream();
void report_event();


// Replace with your network credentials
const char* hostname        = "ESP32CAM";
const char* ssid            = "Arcadia Planitia";
const char* password        = "nukemars69420";
SocketIOclient socketIO;





void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Print ESP32 Local IP Address
  Serial.print("ESPCam IP address: ");
  Serial.println(WiFi.localIP());

  // Setup camera
  Serial.println(setup_camera() ? "CAMERA SETUP" : "ERROR SETTING UP CAMERA");

  // Make socket connection with server address, port and URL
  socketIO.begin("192.168.0.105", 3000, "/socket.io/?EIO=4");

  // SocketIO event handler
  socketIO.onEvent(socketIOEvent);
}





void loop() {
  socketIO.loop();

  if (isLiveStreaming) {
    live_stream();
    Serial.println("Livestreaming...");
  }

  else {

    if (!capture_still()) {
      Serial.println("Capture Failed");
      delay(3000);
      return;
    }
    if (motion_detect()) {
      report_event();
      Serial.println("Motion Detected");
    }
    

    update_frame();
    Serial.println("=================");

  }
}





bool setup_camera() {

  bool setup_ok;

  camera_config_t config;

  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_GRAYSCALE;
  config.frame_size = FRAMESIZE_CIF;
  config.jpeg_quality = 10;
  config.fb_count = 1;

  setup_ok = esp_camera_init(&config) == ESP_OK;

  sensor_t *sensor = esp_camera_sensor_get();
  sensor->set_framesize(sensor, FRAMESIZE_CIF);   // +++ FRAMESIZE_QVGA;

  return setup_ok;
}





/**
   Capture image and do down-sampling
*/

bool capture_still() {

  camera_fb_t *frame_buffer = esp_camera_fb_get();

  if (!frame_buffer)
    return false;


  // set all 0s in current frame
  for (int y = 0; y < H; y++)
    for (int x = 0; x < W; x++)
      current_frame[y][x] = 0;


  // down-sample image in blocks
  for (uint32_t i = 0; i < WIDTH * HEIGHT; i++) {
    const uint16_t x = i % WIDTH;
    const uint16_t y = floor(i / WIDTH);
    const uint8_t block_x = floor(x / BLOCK_SIZE);
    const uint8_t block_y = floor(y / BLOCK_SIZE);
    const uint8_t pixel = frame_buffer->buf[i];
    const uint16_t current = current_frame[block_y][block_x];

    // average pixels in block (accumulate)
    current_frame[block_y][block_x] += pixel;
  }

  // average pixels in block (rescale)
  for (int y = 0; y < H; y++)
    for (int x = 0; x < W; x++)
      current_frame[y][x] /= BLOCK_SIZE * BLOCK_SIZE;

  // executed if debug flag is set to true at the top

#if DEBUG
  Serial.println("Current frame:");
  print_frame(current_frame);
  Serial.println("---------------");
#endif

  return true;
}





/**
   Compute the number of different blocks
   If there are enough, then motion happened
*/
bool motion_detect() {
  uint16_t changes = 0;
  const uint16_t blocks = (WIDTH * HEIGHT) / (BLOCK_SIZE * BLOCK_SIZE);

  for (int y = 0; y < H; y++) {
    for (int x = 0; x < W; x++) {
      float current = current_frame[y][x];
      float prev = prev_frame[y][x];
      float delta = abs(current - prev) / prev;

      if (delta >= BLOCK_DIFF_THRESHOLD) {

#if DEBUG
        Serial.print("diff\t");
        Serial.print(y);
        Serial.print('\t');
        Serial.println(x);
#endif

        changes += 1;
      }
    }
  }

      Serial.print("Changed ");
      Serial.print(changes);
      Serial.print(" out of ");
      Serial.println(blocks);

  return (1.0 * changes / blocks) > IMAGE_DIFF_THRESHOLD;
}





/**
   Copy current frame to previous
*/
void update_frame() {

  for (int y = 0; y < H; y++) {
    for (int x = 0; x < W; x++) {
      prev_frame[y][x] = current_frame[y][x];
    }
  }
}





/**
   For serial debugging
   @param frame
*/
void print_frame(uint16_t frame[H][W]) {

  for (int y = 0; y < H; y++) {
    for (int x = 0; x < W; x++) {
      Serial.print(frame[y][x]);
      Serial.print('\t');
    }

    Serial.println();
  }
}





void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      Serial.printf("Socket Disconnected!");
      break;

    case sIOtype_CONNECT:
      Serial.printf("Socket Connected to url: %sn", payload);
      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;

    case sIOtype_EVENT:
      Serial.printf("Get event: %sn", payload);
      isLiveStreaming = !isLiveStreaming;
      break;
  }
}





void live_stream() {

  unsigned long messageTimestamp = 0;
  uint64_t now = millis();

  // 40 milliseconds simulate approx 24 frames per second
  if (now - messageTimestamp > 40) {
    messageTimestamp = now;

    camera_fb_t * fb = NULL;

    // Take Picture with Camera
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      return;
    }

    // Turn grayscale image into jpeg
    size_t _jpg_buf_len;
    uint8_t * _jpg_buf;
    if (fb->format != PIXFORMAT_JPEG) {
      bool jpeg_converted = frame2jpg(fb, 10, &_jpg_buf, &_jpg_buf_len);
      if (!jpeg_converted) {
        ESP_LOGE(TAG, "JPEG compression failed");
      }
    }


    // Encode picture into base64 string
    String picture_encoded = base64::encode(_jpg_buf, _jpg_buf_len);

    // Create JSON message for Socket.IO (event)
    DynamicJsonDocument doc(15000);
    JsonArray array = doc.to<JsonArray>();

    // add event name
    // Hint: socket.on('event_name', ....
    array.add("jpgstream_server");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["hostname"] = hostname;
    param1["picture"] = picture_encoded;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);
    esp_camera_fb_return(fb);
    free(_jpg_buf);
  }

}





void report_event() {
  camera_fb_t * fb = NULL;

  // Take Picture with Camera
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  // Turn grayscale image into jpeg
  size_t _jpg_buf_len;
  uint8_t * _jpg_buf;
  if (fb->format != PIXFORMAT_JPEG) {
    bool jpeg_converted = frame2jpg(fb, 10, &_jpg_buf, &_jpg_buf_len);
    if (!jpeg_converted) {
      ESP_LOGE(TAG, "JPEG compression failed");
    }
  }


  // Encode picture into base64 string
  String picture_encoded = base64::encode(_jpg_buf, _jpg_buf_len);

  // Create JSON message for Socket.IO (event)
  DynamicJsonDocument doc(15000);
  JsonArray array = doc.to<JsonArray>();

  // add event name
  // Hint: socket.on('event_name', ....
  array.add("motion-detection");

  // add payload (parameters) for the event
  JsonObject param1 = array.createNestedObject();
  param1["hostname"] = hostname;
  param1["picture"] = picture_encoded;

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  socketIO.sendEVENT(output);
  esp_camera_fb_return(fb);
  free(_jpg_buf);
}
