const k8s = require("@kubernetes/client-node");

// Importing Environment Variables
const namespace = process.env.NAMESPACE
// Loading Kubeconfig from ~/.kube directory
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Creating a Client to use autoscaling/v2 API Group
const k8sApi = kc.makeApiClient(k8s.AutoscalingV2Api);


const main = async ()=>{

    // Fetching all HPAs present in a particular Namespace
    try {
        const hpas = await k8sApi.listNamespacedHorizontalPodAutoscaler(namespace, "true");
        hpas.body.items.forEach(async item=>{
            console.log(`Old Min Replicas for ${item.metadata.name}: ${item.spec.minReplicas}`)

            //Fetching the minReplicas annotation
            const newMinReplicas = item.metadata.annotations.minReplicas

            // Define Merge Path config
            const patch =[{
                op: 'replace',
                path: '/spec/minReplicas',
                value: parseInt(newMinReplicas)
            },{
                op: 'replace',
                path: '/metadata/annotations',
                value: {
                    minReplicas: `${item.spec.minReplicas}`
                }
            }]
            const options = { headers: { 'Content-type': k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } };
            try {
                const patchRes= await k8sApi.patchNamespacedHorizontalPodAutoscaler(item.metadata.name, namespace, patch, "true", undefined,undefined,undefined,undefined,options)
                console.log(`New Min Replicas for ${item.metadata.name}: ${patchRes.body.spec.minReplicas}`)
            } catch (error) {
                console.log(error.body.details)
                process.exit(1)
            }
         })
    } catch (error) {
        throw error.body.details
    }
}

main()


