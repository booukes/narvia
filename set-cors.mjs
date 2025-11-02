import BackblazeB2 from 'backblaze-b2'
import 'dotenv/config'

const B2_KEY_ID = process.env.B2_KEY_ID
const B2_APP_KEY = process.env.B2_APP_KEY
const B2_BUCKET_NAME = 'narvia-photos' // <-- change to your bucket name!

const corsRules = [
    {
        corsRuleName: 'allow-everything',
        allowedOrigins: ['*'],
        allowedOperations: [
            'b2_upload_file',
            'b2_download_file_by_name',
            'b2_download_file_by_id',
            'b2_get_upload_url'
        ],
        allowedHeaders: ['*'],
        maxAgeSeconds: 3600
    }
]

const b2 = new BackblazeB2({
    applicationKeyId: B2_KEY_ID,
    applicationKey: B2_APP_KEY,
})

async function setCors() {
    try {
        console.log('🔑 Authorizing...')
        await b2.authorize()
        const buckets = await b2.listBuckets()
        const bucket = buckets.data.buckets.find(b => b.bucketName === B2_BUCKET_NAME)
        if (!bucket) throw new Error('Bucket not found')

        console.log('🧠 Updating CORS...')
        const updated = await b2.updateBucket({
            bucketId: bucket.bucketId,
            corsRules,
            bucketInfo: bucket.bucketInfo,
            lifecycleRules: bucket.lifecycleRules,
            defaultServerSideEncryption: bucket.defaultServerSideEncryption,
            fileLockEnabled: bucket.fileLockEnabled
        })

        console.log('🧾 Backblaze response:\n', JSON.stringify(updated.data.corsRules, null, 2))


        console.log('✅ CORS updated successfully!')
    } catch (err) {
        console.error('❌ Error updating CORS:', err.message)
    }
}

setCors()
