const subscribeToPush = async (req, res) => {
    // Get pushSubscription object
    subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});
}

module.exports = { subscribeToPush }