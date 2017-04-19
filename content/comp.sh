#!/bin/bash

node comp.js $1
wkhtmltopdf html/$1.html pdf/$1.pdf
