#### DEPLOYMENT 

AutoBots has been deployed using **Ansible** on digital ocean. To setup the autoBot on digital ocean platform, we have created two ansible
scripts. The first script is used to create a fresh droplet on digital ocean platform and the second one configures the created droplet
with autoBot code and required packages. We have used ubuntu 16.04 image for our deployment purposes.

#### Pre-requisites

Before running the ansible scripts, the setup process require API tokens and AutoBot email account details so that services can be used.
The machine running the playbook must have below tokens:

1. **APIAITOKEN**: run command: export APAITOKEN=&lt;your API AI token&gt;. This will save the token in ~/.bashrc file
2. **SLACKTOKEN**: run command: export SLACKTOKEN=&lt;your SLACK token&gt;. This will save the token in ~/.bashrc file
3. **DEPLOYMENTTOKEN**: run command: export DEPLOYMENTTOKEN=&lt;your digital ocean account token&gt;. This will also be saved in ~/.bashrc file
4. **AUTOBOTEMAILPASSWORD**: run command: export AUTOBOTEMAILPASSWORD=&lt;your gmail account password&gt;. This will be saved in ~/.bashrc file

Once you have run and saved all above tokens into ~/.bashrc file. you need to source those in order for variables to be available to be used by shell.
Run command: source ~/.bashrc or reboot the system once.

**You also need ansible installed on the host running the configuration scripts.**

#### Running ansible playbooks

To setup and run AutoBot on Digital ocean, run below two ansible scripts on the machine where ansible is configured.

1. **"createDroplet.yml"**: This ansible script is used to create a new droplet on your digital ocean account. The details for the droplet created
                            will be saved in "inventory.ini" file so that the next configuration script can be run.
                            
   run below command to setup the droplet:
   
   ```
        ansible-playbook createDroplet.yml
   ```     
   
 2. **"configureProd.yml"**: This ansible script will configure the newly created droplet. This will install all the required packages,
                              dependencies, code, etc which are requried to run autoBot in a production environment.
       
       run below command to configure the droplet:
   
   ```
        ansible-playbook -i inventory.ini configureProd.yml
   ```                               
                 
 
 Running the two ansible scripts, will run the bot in the cloud, and you are ready to use the autoBot for creating virtual machines for you.
 
 
                            
