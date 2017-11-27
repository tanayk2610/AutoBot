#!/bin/bash
cd /usr/bin;
eclipse -application org.eclipse.equinox.p2.director -repository http://findbugs.cs.umd.edu/eclipse/ -installIU edu.umd.cs.findbugs.plugin.eclipse.feature.group;