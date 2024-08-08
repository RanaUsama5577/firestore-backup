const { onSchedule } = require("firebase-functions/v2/scheduler")
const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require("firebase-functions/v2")
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
//Set Global Options
setGlobalOptions({ maxInstances: 10 })
const bucket = 'gs://backup-on-my-way/OtherCollectionsExports'
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

exports.BackUpCreate = onRequest(
    {
      //region: ["europe-west3"],
      maxInstances: 10,
    },
    (req, res) => { //onSchedule("every day 17:00", async (event) => { 
    console.log("Backup Started")
    const databaseName = client.databasePath('on-my-way-7ee69', '(default)')

    return client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: ['admins', 'banners',
            'bookings',
            'car_services',
            'cars',
            'dashboard_stat',
            'geoFence',
            'mail',
            'notifications',
            'on_boarding_screens',
            'packages',
            'privacy_policy',
            'promo_codes',
            'promotions',
            'rating',
            'rating_settings',
            'roles',
            'services_categories',
            'settings',
            'support',
            'support_request',
            'temporaryPhone',
            'users',
            'users_address']
    })
        .then(responses => {
            const response = responses[0]
            console.log(`Operation Name: ${response['name']}`)
            res.status(200).send("Done")            //return true
        })
        .catch(err => {
            console.error(err)
            res.status(400).send(err.message)
            //return false
        })
})