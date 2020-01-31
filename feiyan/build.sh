#!/bin/bash 
echo "传输文件"
scp -r ./** user01@139.217.218.207:/data/avue/avue-feiyan
echo "部署成功"