# Acceptance Test

## Prerequisites

To test the bot, TAs need to login to this [channel](https://csc510-autobot.slack.com/messages/D86PYAK51/) with the following credentials -
1. Email - softwaregrader@gmail.com
2. Password - NcsuWolfPack

For testing use case 1 & 3 we have already saved the required Digital Ocean keys for TA. TAs will be able to create virtual machines and can verify by pinging to the IP addresses.

**Note:** To test the tokens we created a VM using TAs account and thus TAs might see a breif chat history with AutoBot. The VM has been deleted after testing.

**Note:** TAs will not be able to see the machines on Digital Ocean, because the machines will be created on our Digital Ocean account. This has been discussed with Professor Christopher Parnin.

## Start using bot
Before using the bot, a Digital Ocean account, an API token for your account and a ssh ID is required. We have created a digital ocean account, an API token and a ssh ID which is saved on the bot for testing purpose of TA .
The bot can be started by saying `````hi````` or `````hello````` to the bot and type `````help````` to see the list of bot tasks.

![1](https://media.github.ncsu.edu/user/7998/files/d7ff3c30-d467-11e7-9fd2-43ded0954b34)

## Use Case 1
In the first use case, the bot creates a digital ocean VM with Ubuntu, Fedora, Debian or Centos operating systems. You can ask the bot to create a plain VM or flavored VM with jenkins installed in it.
To start type `````create vm`````. If API token and ssh key id hasn't been provided , Autobot asks you to first save them.  

![2](https://media.github.ncsu.edu/user/7998/files/e5d46b8c-d467-11e7-94e2-15c055a483d6)

Type "save keys" to perform this action.  

![3](https://media.github.ncsu.edu/user/7998/files/f687744c-d467-11e7-8338-b35afb18f87e)  

After typing `````create vm````` the AutoBot asks you about the operating system, the configuration you want (512mb, 1gb, 2gb, ..) and type of the vm.  
You can see four types of operating systems and if you type something else, an error will be shown stating incorrect input.  

If you provide incorrect configuration like 256mb (which Digital Ocean dosen't support) or 512 (instead of 512mb) an error will be shown stating incorrect input.  

![4](https://media.github.ncsu.edu/user/7998/files/0db7f362-d468-11e7-826b-26155a33d578)  

After inserting all required inputs correctly, AutoBot gives the ip address of your vm and you can ssh to it.  

Plain VM:    

![5](https://media.github.ncsu.edu/user/7998/files/19f94e96-d468-11e7-979a-d8fa3a5731f9)    

Flavored VM:    

![6](https://media.github.ncsu.edu/user/7998/files/26161902-d468-11e7-8f1b-b6a5accf1df3)      
  
On Digital Ocean we can see the droplets which we have created.      

![7](https://media.github.ncsu.edu/user/7998/files/6add37d2-d468-11e7-950c-e4a6c794cfe9)    

## Use Case 2

**Note:** For this specific use case, the duration of creation of VM the time varies as it is depended on the network condition on Digital Ocean. Unfortunately, it is not in our hands. We have seen cases in which it took 10 minutes at top but there have been cases where it took 1 hour or more.    

In this use case, the user ask the AutoBot to create an image of a vm with eclipse installed on it to use on Virtual Box on local machine. In this use case we have 4 operating system like the firts use case: Ubuntu, Fedora, Debian and Centos. The user also is asked to select from a list of plugins to install on eclipse. Available plugins are: SpotBugs, Checklist, Hibernate, Subversive. User can select all, some or none of them. The plugins should be seprated by `````,`````. If the user don't want any plugins, user should enter `````none`````. You can use `````create image with eclipse````` to create an image of a vm with eclipse installed.

![use case 2](https://user-images.githubusercontent.com/32002357/33355590-10b9d076-d486-11e7-950a-d56e4b1b3270.png)

If the user enter the wrong name for the operating system or plugins, user will get an error like you see in following screenshots.

## Use Case 3

In this use case the user can manage his/her VMs. After typing `````manage````` user can see the list of his/her VMs and can use one of the two messages the bot provided: delete droplet or update droplet.  

![8](https://media.github.ncsu.edu/user/7998/files/7aa7bc50-d468-11e7-81b8-6011164fb4cf)  

If user types `````delete droplet`````, the AutoBot ask user to enter the ID (DROPLET ID) of the vm user wants to delete and then send an email with an OTP (One Time Password). The user should insert the OTP to confirm the deletion.

**Note:** To retrieve the OTP TAs are requested to login to the GMail account we have created for them using the credentials below - 
1. Email - softwaregrader@gmail.com
2. Password - NcsuWolfPack

![10](https://media.github.ncsu.edu/user/7998/files/7ac5946e-d468-11e7-823a-114ba8b94cf8)  

If user types `````update droplet`````, the AutoBot ask user to enter the ID (DROPLET ID) of the vm user wants to change. Then the AutoBot asks the new configuration and get the user input. Same as the first use case if the user insert the wrong configuration user get the error. Be aware that you can not change the configuration downward.  

![9](https://media.github.ncsu.edu/user/7998/files/7aea310c-d468-11e7-9f8c-74122e565410)  

