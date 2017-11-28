#!/bin/bash
cd /usr/bin;
eclipse -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/releases/oxygen/ -installIU org.eclipse.emf.cdo.server.hibernate.source.feature.group;