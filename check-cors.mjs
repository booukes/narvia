import BackblazeB2 from 'backblaze-b2'
import 'dotenv/config'

const b2 = new BackblazeB2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APP_KEY,
})

await b2.authorize()
const res = await b2.listBuckets()
const bucket = res.data.buckets.find(b => b.bucketName === 'narvia-photos')
console.log(JSON.stringify(bucket.corsRules, null, 2))
