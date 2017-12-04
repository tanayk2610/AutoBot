# Autobot Project Report  
  
## The problem our Bot is solving  

Currently Developers face the challenge of creating development environments as it involves installing numerous packages and softwares with plugins, which could be tedious and time consuming.
New releases and constant updates to softwares and applications for bug fixes and compatibility with newer products is to be performed to bolster efficiency and also prevent usage of outdated software.Using package managers to bundle dependencies and also using automation tools such as ansible to automate processes is a viable solution to enhance productivity.
 
 Autobot performs the above with ease as any developer who requires an environment say a virtual machine with a jenkins server or an operating system with eclipse and plugins installed just needs to instruct the bot to perform actions useful to the developer.  
Handling nested Virtual machines manually could take away precious time from co-workers hence, Autobot performs VM management, installation and deployment saves enormous effort and time, which enables developers to perform other important tasks.The autobot also takes care of security flaws and accidental user mistakes by incorporating OTP system. In the event someone(attacker) other than the developer tries to delete a running virtual machine, the autobot generates a OTP and sends it to user mail account. Without the OTP the the Autobot will not delete the Virtual Machine.  

## Primary Features and Screenshots   

We have identified three main features for our slack bot, and these are described below:  

##### Provision a new virtual machine:  

Users can provision a new virtual machine on “Digital Ocean”, by providing their desired configurations through a text based chat on Slack. 
Once AutoBot has the required parameters, and the access token for users “Digital Ocean” account, AutoBot will trigger virtual machine creation process and will provide the “IP address” to the users so that they can ssh into it. 
Users can also trigger the process for creating a flavored virtual machine.  
A flavored virtual machine is a plain VM with jenkins already installed on it.   
**Note:** For creating virtual machines, users first have to save their keys using “Save keys” command.  
Below is a screenshot for the same:  

![1](https://media.github.ncsu.edu/user/7998/files/f687744c-d467-11e7-8338-b35afb18f87e)

Below is the screenshot for creating a plain virtual machine:

![2](https://media.github.ncsu.edu/user/7998/files/19f94e96-d468-11e7-979a-d8fa3a5731f9)  

Below is the screenshot for creating a flavored virtual machine:

![3](https://media.github.ncsu.edu/user/7998/files/26161902-d468-11e7-8f1b-b6a5accf1df3) 

##### Create a virtual machine image with eclipse and plugins:  

Users can request AutoBot to create a virtual machine image with eclipse already installed on it. 
Users can also request to install eclipse plugins (we support 4 eclipse plugins at this moment), with the image they have requested.
 AutoBot will ask for parameters such as kind of operating system (we support ubuntu, centos, fedora, debian), RAM size, number of cores requested and then will create an OVF file which users can import in virtualbox installed on their local machine.
 AutoBot will provide a download link from where users can download the generated OVF file.
 
 ![4](https://user-images.githubusercontent.com/32002357/33355590-10b9d076-d486-11e7-950a-d56e4b1b3270.png)

##### Manage Reservations:  

AutoBot will keep track of all the reservations which users have made on their “Digital Ocean” account. This will help users to review what all machines they have running on digital ocean (resource tracking).

![5](https://media.github.ncsu.edu/user/7998/files/7aa7bc50-d468-11e7-81b8-6011164fb4cf) 

AutoBot also provides feature to delete or update an existing reservation. Users can terminate the virtual machine if they no longer need it. For termination a droplet, AutoBot will send a one time password (OTP) to user's registered email, and users are expected to provide this OTP as a confirmation action for terminating an instance.

![6](https://media.github.ncsu.edu/user/7998/files/7ac5946e-d468-11e7-823a-114ba8b94cf8) 

User can also update the virtual machine configuration based on their needs (re-sizing the droplet).

![7](https://media.github.ncsu.edu/user/7998/files/7aea310c-d468-11e7-9f8c-74122e565410)  

## Reflection on the development process and project

While developing this project we got to learn and work with new technologies like Packer, Slack-bots and API.ai. It was a great experience to be familiar with new technologies trending in the industry. Also we got to learn how to work using agile process development by conducting bi-weekly meetings for each iteration and working with a useful task tracking tool Trello. When using Trello, we got to know the status of assigned tasks, which tasks were on waiting and which task needed more attention and work which helped us to track the every process of the project development. One of the useful agile practices that we used was "Pair Programming". This technique helped us to learn new technologies better and developed code with higher quality.

We faced enormous amount of challenges throughout the project such as issues with packer, issues with asynchronous nature of node js and a lot more, which ultimately motivated us to dig deep and come up with some working solutions to these problems. We definitely got a gist of how real life projects are handled by working throughout each phases of Software Development Lifecycle, such as Design Milestone, Service Milestone, Testing phase and finally deployment. At last, we think this project is very useful in industries too and can be extended with new features and functionalities in nearby future.

## Limitations and Future Work
  
##### Limitations  
Based on the current design and implementation, we have some limitations for our AutoBot project:  

* Currently AutoBot only supports virtual machine creation on “Digital Ocean” Platform, and users are required to have their account created on “Digital Ocean”, so that they can create virtual machines using our Slack Bot.
* Use case 2 of the bot, which includes creating an image using "Packer" with configurations parameters taken from users, is expected to have random run times based on the performance of the production server (which is controlled by Digital Ocean) and also depends on the virtualization aspects on the production server.
 There have been cases where it has taken 10 minutes to run and there have been cases where it took anytime between 1 hour to 5 hours (approximations).  
* AutoBot requests for “Digital ocean token” from users in order to spin virtual machines, and digital ocean tokens have “rate limits” after which they expires and thus can not be used again.
 In such cases, users are requested to save their keys again by providing new “token” to AutoBot.  
  
##### Future Scope  
We have identified some features which are planned for our future release. Some of the planned future work is described below:  

* We are planning to make AutoBot as platform agnostic, which means adding support for other cloud platforms like Amazon, Azure, Google Cloud platform etc.  
* We have planned to add a “price feature”, which is a general recommendation from AutoBot to users, before they spin virtual machines on cloud. 
Basically, AutoBot will scour the web based on the requested parameters from users, and then will recommend which cloud platform to go for based on the price per hour for the virtual machine creation.
 This will let users to make an informed decision.  
* We have also planned to optimize the packer performance by deploying AutoBot, in production environments which supports nested virtualizations. 
We have identified that cloud providers like Amazon, has started providing instances which supports nested virtualization in a clean and neat way.  


## Project Presentation:

##### [Presentation Video](https://www.youtube.com/watch?v=e8kD_S5bZ7I&t=4s)
##### [Presentation Slides](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/REPORT.pptx)

