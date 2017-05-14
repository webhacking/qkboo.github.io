

####  xfs 파일시스템을 생성하기 위해

odroid c2 Ubuntu 16.04 배포본에서는 xfs 지원이 안되는 듯...


```
# apt install xfsprogs
 ```


Create .xfs file system


```
# mkfs.xfs /dev/usb64_vg/db_xfs
```



# odroid c2 booting problems



```
�GXBB:BL1:08dafd:0a8993;FEAT:EDFC318C;POC:3;RCY:0;EMMC:800;NAND:81;SD:0;READ:0;CHK:0;
TE: 283224
no sdio debug board detected

BL2 Built : 11:44:26, Nov 25 2015.
gxb gfb13a3b-c2 - jcao@wonton

Board ID = 8
set vcck to 1100 mv
set vddee to 1050 mv
CPU clk: 1536MHz
DDR channel setting: DDR0 Rank0+1 same
DDR0: 2048MB(auto) @ 912MHz(2T)-13
DataBus test pass!
AddrBus test pass!
Load fip header from SD, src: 0x0000c200, des: 0x01400000, size: 0x000000b0
Load bl30 from SD, src: 0x00010200, des: 0x01000000, size: 0x00009ef0
Sending bl30........................................OK.
Run bl30...
Load bl301 from SD, src: 0x0001c200, des: 0x01000000, size: 0x000012d0
Wait bl30...Done
Sending bl301.....OK.
Run bl301...
d bl31 from SD, src: 0x00020200, des: 0x10100000, size: 0x00011130


--- UART initialized after reboot ---
[Reset cause: unknown]
[Image: unknown, amlogic_v1.1.3046-00db630-dirty 2016-08-31 09:24:14 tao.zeng@droid04]
bl30: check_permit, count is 1
bl30: check_permit: ok!
chipid: ef be ad de d f0 Load bl33 from SD, src: 0x00034200, des: 0x01000000, size: 0x00068270
ad ba ef be ad de not ES chip
[0.398147 Inits done]
secure task start!
high task start!
low task start!
NOTICE:  BL3-1: v1.0(debug):4d2e34d
NOTICE:  BL3-1: Built : 17:08:35, Oct 29 2015
INFO:    BL3-1: Initializing runtime services
INFO:    BL3-1: Preparing for EL3 exit to normal world
INFO:    BL3-1: Next image address = 0x1000000
INFO:    BL3-1: Next image spsr = 0x3c9


U-Boot 2015.01 (Feb 01 2017 - 22:27:26)

DRAM:  2 GiB
Relocation Offset is: 76f3e000
-------------------------------------------------
* Welcome to Hardkernel's ODROID-C2
-------------------------------------------------
CPU : AMLogic S905
S/N : HKC213254DFD2076
MAC : 00:1e:06:33:6c:f6
BID : HKC2211606
-------------------------------------------------
register usb cfg[1][0] = 0000000077f97508
register usb cfg[0][1] = 0000000077f97530
vpu detect type: 5
vpu clk_level = 7
set vpu clk: 666667000Hz, readback: 666660000Hz(0x300)
MMC:   aml_priv->desc_buf = 0x0000000073f36d30
aml_priv->desc_buf = 0x0000000073f38ec0
SDIO Port B: 0, SDIO Port C: 1
ret = 1 .[mmc_init] mmc init success
In:    serial
Out:   serial
Err:   serial
----------------------------------
MMC Size : 16 GB
----------------------------------
** Unrecognized filesystem type **
** Unrecognized filesystem type **
movi: the partiton 'logo' is reading...

MMC read: dev # 0, block # 61024, count 2048 ... 2048 blocks read: OK
hpd_state=1
[CANVAS]addr=0x3f800000 width=3840, height=1440

set hdmitx VIC = 16
hdmitx phy setting done
set hdmitx VIC = 16
hdmitx phy setting done
Error: Bad gzipped data
There is no valid bmp file at the given address
Net:   Meson_Ethernet
Hit [Enter] key twice to stop autoboot:  0
4887 bytes read in 15 ms (317.4 KiB/s)
cfgload: applying boot.ini...
cfgload: setenv rootdev "/dev/mmcblk0p1"
cfgload: setenv m "1080p60hz" # Progressive 60Hz
cfgload:
cfgload: setenv cec "cecf"
cfgload: setenv m_bpp "24"
cfgload: setenv mesontimer "0"
cfgload: setenv nographics "0"
cfgload: setenv maxcpus "4"
cfgload: setenv max_freq "1536"  # 1.536GHz
cfgload: setenv condev "console=ttyS0,115200n8 console=tty0 consoleblank=0"   # on both
cfgload: setenv verbosity "1"
cfgload: setenv bootargs "root=${rootdev} rootwait rootflags=data=writeback rw ${condev} no_console_suspend hdmimode=${m} m_bpp=${m_bpp} vout=${vout} fsck.repair=yes loglevel=${verbosity} net.ifnames=0 ${extraargs}"
cfgload: setenv loadaddr "0x11000000"
cfgload: setenv dtb_loadaddr "0x1000000"
cfgload: setenv initrd_loadaddr "0x13000000"
cfgload: ext4load mmc 0:1 ${initrd_loadaddr} /boot/uInitrd || fatload mmc 0:1 ${initrd_loadaddr} uInitrd || ext4load mmc 0:1 ${initrd_loadaddr} uInitrd
6195647 bytes read in 297 ms (19.9 MiB/s)
cfgload: ext4load mmc 0:1 ${loadaddr} /boot/zImage || fatload mmc 0:1 ${loadaddr} zImage || ext4load mmc 0:1 ${loadaddr} zImage
13038088 bytes read in 600 ms (20.7 MiB/s)
cfgload: ext4load mmc 0:1 ${dtb_loadaddr} /boot/dtb/meson64_odroidc2.dtb || fatload mmc 0:1 ${dtb_loadaddr} dtb/meson64_odroidc2.dtb || ext4load mmc 0:1 ${dtb_loadaddr} dtb/meson64_odroidc2.dtb
29264 bytes read in 23 ms (1.2 MiB/s)
cfgload: fdt addr ${dtb_loadaddr}
cfgload: if test "${mesontimer}" = "0"; then fdt rm /meson_timer; fdt rm /cpus/cpu@0/timer; fdt rm /cpus/cpu@1/timer; fdt rm /cpus/cpu@2/timer; fdt rm /cpus/cpu@3/timer; fi
libfdt fdt_path_offset() returned FDT_ERR_NOTFOUND
libfdt fdt_path_offset() returned FDT_ERR_NOTFOUND
libfdt fdt_path_offset() returned FDT_ERR_NOTFOUND
libfdt fdt_path_offset() returned FDT_ERR_NOTFOUND
cfgload: if test "${mesontimer}" = "1"; then fdt rm /timer; fi
cfgload: if test "${nographics}" = "1"; then fdt rm /meson-fb; fdt rm /amhdmitx; fdt rm /picdec; fdt rm /ppmgr; fdt rm /meson-vout; fdt rm /mesonstream; fdt rm /deinterlace; fdt rm /codec_mm; fdt rm /reserved-memory; fdt rm /aocec; fi
cfgload: booti ${loadaddr} ${initrd_loadaddr} ${dtb_loadaddr}
## Loading init Ramdisk from Legacy Image at 13000000 ...
   Image Name:   uInitrd
   Image Type:   AArch64 Linux RAMDisk Image (gzip compressed)
   Data Size:    6195583 Bytes = 5.9 MiB
   Load Address: 00000000
   Entry Point:  00000000
   Verifying Checksum ... OK
load dtb from 0x1000000 ......
## Flattened Device Tree blob at 01000000
   Booting using the fdt blob at 0x1000000
   Loading Ramdisk to 7394b000, end 73f3397f ... OK
   Loading Device Tree to 000000001fff5000, end 000000001ffff24f ... OK

Starting kernel ...

uboot time: 4663281 us
```






## 서버 보안 설정

ubuntu-2securities 에 정리된 데로 보안 설정을 한다.

### fail2ban 0.9 최신버전 설치

https://github.com/fail2ban/fail2ban/archive/debian/0.9.6-1.tar.gz


#### sudo chkrootkit 실생



```
Possible Linux/Ebury - Operation Windigo installetd
```

http://askubuntu.com/questions/709545/chkrootkit-says-searching-for-linux-ebury-operation-windigo-ssh-possible-l



## SD Card 이동하기

8GB SD card 에 설치된 이미지를 16GB로 이동한다.

### 이미지로 저장후 쓰기

```sh
$ dd if=/dev/sdc of=/path/to/image bs=4m

$ dd if=/path/from/image of=/dev/sdd bs=4m
```

> raspberry pi의 경우 `raspi-config` 를 통해서 resize2fs 툴로 확장해 주낟.

### Resize root partition

> resize root fs
> https://raspberrypi.stackexchange.com/questions/499/how-can-i-resize-my-root-partition

The Short Version:

Backup your system
Remove the main and swap partitions (leaving the boot partition alone)
Recreate the main partition to utilize the remaining disk space (excluding the boot partiton). Make sure to reuse the same start sector as the original root partition.
reboot the system
resize the new boot root partition to utilize the full partition size.


### 
http://elinux.org/RPi_Resize_Flash_Partitions


### 디스크에 바로 쓰기

```sh
$ dd if=/dev/sdc of=/dev/sdd bs=4m
```
