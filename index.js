const k8s = require("@kubernetes/client-node");
const dotenv = require("dotenv").config()

// Importing Environment Variables
const namespace = process.env.NAMESPACE
const newMinReplicas = process.env.NEW_MIN_REPLICAS

// Loading Kubeconfig from ~/.kube directory
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Creating a Client to use autoscaling/v2 API Group
const k8sApi = kc.makeApiClient(k8s.AutoscalingV2Api);


const main = async ()=>{

    // Fetching all HPAs present in a particular Namespace
    const hpas = await k8sApi.listNamespacedHorizontalPodAutoscaler(namespace, "true");
    hpas.body.items.forEach(async item=>{
        console.log(`Old Min Replicas for ${item.metadata.name}: ${item.spec.minReplicas}`)
        const patch =[{
            op: 'replace',
            path: '/spec/minReplicas',
            value: parseInt(newMinReplicas)
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
}

main()


