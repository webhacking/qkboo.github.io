# LVM

## 디스크 파티션

시스템에 사용할 디스크 파티션을 생성한다. 그리고 사용할 디스크 파티션 타입을 LVM으로 한다.
LVM 파티션을 사용하도록 볼륨을 만든다.

### parted

대상 디스크 확인

```
$parted -l
```

parted로 lvm 볼륨 잡기

```sh
parted /dev/sdb
(parted) mklabel gpt                                                      
(parted) unit GB
(parted) mkpart primary 0 32.0GB
(parted) set 1 lvm on
(parted) print           
```


#### fdisk 사용

```
# fdisk /dev/sda
Command (m for help): p
Command (m for help): g  
Command (m for help): n
Last sector, +sectors or +size{K,M,G,T,P} (2048-125042654, default 125042654): +4G
Command (m for help): t
Hex code (type L to list all codes): 30
Changed type of partition 'Linux filesystem' to 'Linux LVM'.
```


## LVM 생성하기

1. LVM으로 파티션한 볼륨으로 Pysical volume 을 생성한
2. Pysical volume을 Volume Group으로 등록한다.
3. 실제 사용할 크기 만큼 Logical Volume을 생성한다.
4. 파일 시스템을 생성하고 마운트 한다.


```
apt install lvm2
```

파티션을 Pysical volume으로 만든다.

```
# pvcreate /dev/sda2
  /run/lvm/lvmetad.socket: connect failed: No such file or directory
  WARNING: Failed to connect to lvmetad. Falling back to internal scanning.
  Physical volume "/dev/sda2" successfully created
```

이제 물리볼륨을 로지컬 볼륨 그룹으로 나누고 

```
# vgcreate vg_usb /dev/sdb1
 Volume group "vg_usb" successfully created

# vgdisplay

```


> 볼륨그룹 지우기
> 
> ```
> # vgremove vg_usb
>   Volume group "vg_usb" successfully removed
> ```
>  


로지컬 볼륨을 만든다.

```
# lvcreate -L +30G -n dbvol vg_usb  
 Logical volume "dbvol" created.
```

로지컬 볼륨 지우기

```
# lvremove /dev/dbvol/dbvol
```


#### 파일시스템 생성

마운트 하기

```
# mkfs.ext4 /dev/vg_usb/dbvol
# mkdir /data
```


fstab에 등록하기

마운트 하기 위해서 `lvdisplay` 명령으로 LV path 를 확인한다.

```
# lvdisplay
  --- Logical volume ---
  LV Path                /dev/vg_usb/dbvol
```



#### LVM 사이즈 키우기

```
# lvextend -L +10M /dev/um_vg/xfs_lv -r
```

> https://www.rootusers.com/lvm-resize-how-to-decrease-an-lvm-partition/


#### LVM 을 새 시스템에 장착하기

LVM으로 생성한 볼륨그룹을 다른 시스템에서 사용하려면 Volume group을 이용한다.

1. volume group 비활성화
2. volume group 추출
3. 새 시스템에서 volume group 가져오기
4. 새 시스템에서 volume group 활성화
5. 새 시스템에서 마운트

##### 1. vgscan으로 확인

```
# vgscan
  Reading all physical volumes.  This may take a while...
  Found volume group "vg_usb" using metadata type lvm2
```


##### 2. vg 추출

```
# vgexport vg_usb
  Volume group "vg_usb" successfully exported
```

이제 새 시스템에서 추출한 volume group을 활성화 한다.

##### 3. 

pvscan으로 파티션을 확인한다. 비활성화하고 추출한 파티션을 확인할 수 있다.

```
# pvscan
  PV /dev/sda2    is in exported VG vg_usb [55.62 GiB / 25.62 GiB free]
  Total: 1 [55.62 GiB] / in use: 1 [55.62 GiB] / in no VG: 0 [0   ]
```

vbimport 로 volume group을 가져온다.

```
# vgimport vg_usb
  Volume group "vg_usb" successfully imported
```


##### 4. 활성화

```
# vgchange -ay vg_usb
  1 logical volume(s) in volume group "vg_usb" now active
```

마운트 하기 위해서 `lvdisplay` 명령으로 LV path 를 확인한다.

```
# lvdisplay
  --- Logical volume ---
  LV Path                /dev/vg_usb/dbvol
  LV Name                dbvol
  VG Name                vg_usb
  LV UUID                hTnMaP-6rgM-ePOi-HXs4-X0Ia-h4mP-gpT1JM
  LV Write Access        read/write
  LV Creation host, time odroid64, 2016-12-02 15:05:45 +0900
  LV Status              available
  # open                 0
  LV Size                30.00 GiB
  Current LE             7680
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

mount 명령으로 LV path를 마운트 한다.

```
/dev/mapper/vg_usb-dbvol on /data type ext4 (rw,relatime,data=ordered)
```

마운트한 경로를 /etc/fstab에 추가한다. 


#### LVM error

기존 LVM 디스크를 사용하던 OS에 새 OS를 설치하고 기존 LVM을 사용하려는데 다음 같이 lvmetad 에러가 난다.

> /run/lvm/lvmetad.socket: connect failed: No such file or directory


If you are using lvm and systemd do:

```
systemctl enable lvm2-lvmetad.service
systemctl enable lvm2-lvmetad.socket
systemctl start lvm2-lvmetad.service
systemctl start lvm2-lvmetad.socket
```




###  xfs 파일시스템을 생성하기 위해

odroid c2 Ubuntu 16.04 배포본에서는 xfs 지원이 안되는 듯...

> https://linhost.info/2012/08/format-a-volume-as-xfs-in-debian-and-ubuntu/
> [https://www.unixmen.com/create-xfs-file-system-based-lvm-ubuntu/](https://www.unixmen.com/create-xfs-file-system-based-lvm-ubuntu/)


```
# apt install xfsprogs
 ```


Create .xfs file system


```
# mkfs.xfs /dev/usb64_vg/db_xfs
```


## 참조
 - 
참조: [https://www.unixmen.com/create-xfs-file-system-based-lvm-ubuntu/](https://www.unixmen.com/create-xfs-file-system-based-lvm-ubuntu/)

