# SERVICE MILESTONE

In the previous milestone we implemented the bot interaction along with mock responses of API calls using _nock_. In this milestone, we have implemented actual API calls and the user can now actually perform all the tasks listed in the use cases.

Below are the use cases and the respective endpoints of API calls that are used in them.

#### USE CASE 1 - Provision a new Virtual Machine

**ENDPOINT:**
* Create droplet - _**POST v2/droplets**_
* Get IP - _**GET v2/droplets/dropletId**_
* Delete image - _**DELETE v2/images/imageId**_

**SERVICE:** Before performing use cases 1 and 3, user is required to provide his Digital Ocean API key. While execution of use case 1, AutoBot creates a droplet using the first endpoint above and the user provided API key. AutoBot supports 2 types of VMs (droplets)- plain and (Jenkins) flavored - with multiple OSs - Ubuntu, Debian, Fedora and CentOS. 

To create a flavored VM, a plain VM is created first, which is then converted into a snapshot image. Using this image, a Jenkins flavored VM is created. After this new VM is provisioned the snapshot image is deleted using the third API call stated above.

#### USE CASE 2 - Setup virtual machine with Eclipse and selective plugins installed using Packer

**ENDPOINT:**
* Upload file - _**POST /b/bucket/o**_
* Make file public - _**PUT /b/bucket/o/object**_

**SERVICE:** In this use case, GCP(Google Cloud Platform) API calls are made using GCP's NodeJS library. These calls are used to upload the file on GCP storage so that the files are available for user to download. Along with these calls, *packer* and VirtualBox applications are used to create VM images in OVF format which are then uploaded.

#### USE CASE 3 - Management of Virtual Machines

**ENDPOINT:**
* Resize droplet - _**POST v2/droplets/dropletId**_
* Delete droplet - _**DELETE v2/droplets/dropletId**_

**SERVICE:** In this use case, we use Digital Ocean API calls to manage reservations of user made by our bot. Using the above stated endpoints, API calls are made which are used to change the configuration and delete a VM respectively.

## WORKSHEET
You can see our task tracking for week 4 to week 6 in [WORKSHEET.md](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/WORKSHEET.md).

## SCREENCAST

In the [screencast](https://youtu.be/IBnlUZ6Gx4A), we have demoed all the use cases performed manually using our bot - AutoBot

## Contributions

| Team Member   | Contribution   
| ------------- | ------------ 
| Bhavya Bansal      |  Use case 1, Use Case 2      
| Nitish Raghunathan     |    Use Case 2, Use Case 1
| Pushpendra Singh Patel |    Use Case 3, Use Case 2
| Rezvan Mahdavi Hezaveh  |   Use Case 2, Use Case 1
| Tanay Kothari | Use Case 2, Use Case 1
 
