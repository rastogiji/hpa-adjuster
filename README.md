# Kubernetes CronJob for HPA Updater

This repository contains configuration and code to run a Kubernetes CronJob that updates the minimum replicas of Horizontal Pod Autoscalers (HPAs) within a Kubernetes cluster on a scheduled basis.


## Description

This CronJob is designed to periodically execute a Node.js script using a Kubernetes CronJob resource. The script interacts with the Kubernetes API to fetch and update the minimum replicas of HPAs within a specified namespace. It works by using Kubernetes Annotations.

## Prerequisites

Before setting up and using this CronJob, ensure that you have the following prerequisites:

- A running Kubernetes cluster.
- `kubectl` configured to interact with your cluster.
- A **minReplicas** annotation to all your HPAs specifying the min replica count you would like the cronjob to apply during scale down/up.

## Installation
1. Clone the Repository
    ```shell
    git clone https://github.com/rastogiji/hpa-adjuster.git
    cd kubernetes-cronjob-hpa-updater
    ```

1. Creating and Pushing the Docker container to your Docker Repository

1. Make appropriate changes to cronJob.yaml files to fileds enclosed in **<>**. Create a Kubernetes CronJob by applying the configuration:
    ```shell
    kubectl apply -f cronJob.yaml
    ```
This will create a CronJob resource that schedules the execution of your HPA updater script.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
1. Create a new branch for your feature or bug fix.
1. Make your changes and ensure that the code is well-documented.
1. Open a pull request, describing the changes you've made and their purpose.
