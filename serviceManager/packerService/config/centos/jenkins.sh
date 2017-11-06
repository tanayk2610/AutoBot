sudo wget  -O /etc/yum.repos.d/jenkins.repo   http://jenkins-ci.org/redhat/jenkins.repo
sudo rpm  --import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key
sudo yum  install jenkins
/etc/init.d/jenkins start
chkconfig jenkins on
netstat -ntulp | grep 8080
