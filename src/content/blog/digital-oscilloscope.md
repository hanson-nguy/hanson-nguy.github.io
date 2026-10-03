---
title: Zynq Ultrascale Plus Data Acquisition Platform
description: This project develops a data acquisition test platform using the Zynq UltraScale+ MPSoC. An ADC emulator implemented in the programmable logic generates SNSPD-like signals, which are serialized and transmitted through a custom hardware data path. A corresponding receiver deserializes the data and transfers it to the processing system, providing software access to the acquired signals. The project serves as a practical tutorial for developing and integrating custom hardware and data acquisition pipelines on the Zynq UltraScale+.
date: 2026-05-08
image: /images/zynq_daq_architecture.png
tags: ["data acquisition", "System on a chip", "analog-to-digital", "FPGA"]
category: hobby
---

# Zynq Ultrascale Plus, ZCU102 Data Acquisition Platform

# Overview
The Zynq Ultrascale Plus is an FPGA multi-processor system on a chip (MPSoC) that we can use to implement a testing platform for designing a full data acquisition stack. The Zynq Ultrascale Plus is equipped with an FPGA based on 16nm fin fet technology, application processing unit, real time processing unit, and a GPU. The architecture can be broken down into a processing system (PS) side and a programmable logic (PL) side. Here, I implement an analog-to-digital converter emulator, generating SNSPD-like signals which then are serially transmitted. I also implement a receiver side, which then takes the serialized data and transmits it the the processing unit, giving the user access to the data. This mark down will outline the basic steps I used in achieving this, as a tutorial for developing custom hardware on the Zynq Ultrascale Plus. 

![](/public/images/digital_oscilloscope/data_acq_set_up.png)
*Figure 1: Full data aquisition set up*

# RTL Architecture 
![](/public/images/digital_oscilloscope/zynq_daq_architecture.png)
*Figure 2: System architecture overview.*

The top module depicts the pseudo-random generation of SNSPD-like pulses. The linear feedback shift register is a computational strategy to generate pseudo random signals with a uniform distribution. The value of the linear feedback shift register can be compared to some threshold value to generate a Poissonian-like random generation of pulses. When a trigger occurs, the pulses is added onto any residual signal before, allowing for multiple spikes. The decaying shift register exponentially decays the signal, similar to the LR behavior of typical SNSPD signals. This data (14 bits) is then fed into a serializer, which would allow for fast transfer of data.


The architecture depicted below the signal generation module is the serialization and deserialization of 14-bit streaming data. The design challenge is switching from a 14-bit signal to an 8-bit signal that can be serialized and deserialized by the native OSERDES an ISERDES blocks. The design of the OSERDES block is relatively simple and requires 3 different clock domains. There the first the reference clock, clk_tx, which defines the bit alignment. The divided clock, clk_tx_div goes at a clock speed 1/4 clk_tx, and is required for the SERDES modules. The pixel clock, clk_px then defines the word length. Here, we use 14 bit data, so the clock speed of clk_px is 1/7 clk_tx, since the SERDES modules operate in double data rate (DDR), in which data is transferred both on the rising and falling edges. The data is first sampled at the clk_px rate. The 14-bit data stream moves into a custom gearbox module, which translates the 14-bit data stream in the clk_px domain to a 8-bit data stream in the clk_tx_div domain. This is acheieved by using a cyclical shift register that simulteously writes and reads, asynchronously. Since the two clocks are aligned to the reference clock and are related to the data width, the rate that data is streamed in is equivalent to the rate that data is streamed out. enabling the shift register width to simply be a common multiple of the 14-bit and 8-bit data streams. The outputted data then gets streamed into the OSERDES module, which outputs serialized data at the same rate as the reference clock, clk_tx. For word alignment, a 14-bit clock pattern aligned with the captured data moves through a stream of modules that enable the receiving end to decode the 14-bit data stream. The data, the clk_tx, and clk_tx_div domains are then streamed out through FMC connectors in differential pairs. 

On the deserialization side, the signals each enter a buffer that generates a single signal off the differental pair. The clk_tx and clk_tx_div signal are used to decode the serial data stream through the ISERDES module. The data stream is then decoded into 14-bit data streams by aligning the data with the clk_px signal. For faster clocking speeds, the alignment of the clocks received by the ISERDES from the OSERDES modules requires more infrastructure due to the delay between various traces, which can cause instabililty. 

<!-- > This ip block is available under the project folder adc_emulator. -->



## Test Bench
Running simulated results are important to test the operation of your design. Plotted below in Fig. 3 are the testbench results of this infrastucture. The resolution of these pulses are chosen arbitrarily and can be tuned to the clock speed available. The important aspect to look at is the 1-to-1 transfer of data from the OSERDES modules to the ISERDES modules. In Fig. 4, the serialization protocal is shown, in which fco is the frame clock that defines each word, and dco is data clock that defines the bit value on each rising and falling edge.

![](/public/images/digital_oscilloscope/testbench_waveform.png)

![](/public/images/digital_oscilloscope/python_waveform.svg)
![](/public/images/digital_oscilloscope/python_waveform_zoomed.svg)
*Figure 3: Input and output signals.*

![](/public/images/digital_oscilloscope/serialized_plotted.svg)
*Figure 4: Serialized data.*

This design was based off of https://www.analog.com/en/products/ad9249.html


## Logic Analyzer
One useful tool of debugging are logic analyzers. Thus, Vivado offers integrated logic analyzers (ILAs) to read out signals with respect to some reference clock signal, which can be implemented into the IP block design. Figure 5 shows how you can hook up a system ILA, by simple connecting the wires we want to probe to various probes in the system ILA, which can be customized by double clicking the system ILA IP block and changing the number of probes. 

![](/public/images/digital_oscilloscope/ip_block.png)
*Figure 5: IP block with system integrated logic analyzer.*
![](/public/images/digital_oscilloscope/step_1_logic_analyzer.png)

You can access the ILA by connecting to Zynq board through JTAG and opening the hardware manager
![](/public/images/digital_oscilloscope/step_2_logic_analyzer.png)

Right click on the chip to program the device using the bitstream.
![](/public/images/digital_oscilloscope/step_3_logic_analyzer.png)

The ILA should appear in the main panel. To get the analog view of the waveform, right click the waveform and navigate ``` Waveform Style -> Analog Settings -> Hold -> Ok```

To package the design into an IP block, click ```Tools -> Create and Package New IP``` and follow the prompts. Note where the IP module is stored, as this will be the repository we will add into our main project.

# Implementation on Zynq Ultrascale+ MPSoC Board
Now that we have the hardware design of the serialization and deserializaton modules, we can now implement this to interface with the processing system. Below is a step-by-step demonstration of adding the ip blocks needed and creating a direct memory access block for the data to stream from the programmable logic to the processing system memory.

## Hardware design
First, click on Settings in the Project Manager.
![](/public/images/digital_oscilloscope/step_1_zynq.png)

Under IP tab, click on Repository and add the repository that you stored your RTL design.
![](/public/images/digital_oscilloscope/step_2_zynq.png)

<!-- ![](/public/images/digital_oscilloscope/step_3_zynq.png) -->

Now click on ```Create Block Design ``` under ```IP INTEGRATOR``` and name your design.
![](/public/images/digital_oscilloscope/step_4_zynq.png)

Click ```Add IP``` and type in the name of your IP block. Add this to the design. 
![](/public/images/digital_oscilloscope/step_5_zynq.png)

We can now build our entire system, as seen below:
![](/public/images/digital_oscilloscope/full_ip_block.png)

Make sure to have the following settings:

**AXI Direct Memory Access**
![](/public/images/digital_oscilloscope/step_6_zynq.png)

**AXI4-Strem Data FIFO**
![](/public/images/digital_oscilloscope/step_7_zynq.png)

**Zynq Ultrascale+ MPSoC PS-PL Configuration**

We will enable the AXI HPM0 LPD and AXI HP0 FP0 ports to interface between the RTL and the processing systems.
![](/public/images/digital_oscilloscope/step_8_zynq.png)

**Zynq Ultrascale+ MPSoC DDR Configuration**
![](/public/images/digital_oscilloscope/step_9_zynq.png)

**Zynq Ultrascale+ MPSoC Clock Configuration**
![](/public/images/digital_oscilloscope/step_10_zynq.png)
In this design, the custom IP block can be substituted with any data streaming module, as long as the AXI ports are defined properly. For these modules, the most important signals are ```tready```. ```tvalid```, ```tdata```, ```tkeep```, and ```tlast```more information about creating custom AXI ports, visit https://docs.amd.com/v/u/en-US/ug1037-vivado-axi-reference-guide. Here, I am using a test module that simply generates SNSPD-like signals without going through the FMC cables, for simplicity.


Now that the design is complete, right click on the .bd design and click ```Reset Output Products``` followed by ```Generate Output Products```, ```then Create HDL Wrapper```. 
![](/public/images/digital_oscilloscope/step_11_zynq.png)

If your design has any I/O interface, you will have to also add a constraint file to map those ports to physical pins. You can do this my clicking ```Add Sources (Alt + A)``` and adding a constraint source. The naming of the file does not matter. Below is an example of a constraint file connect FMC ports

```#create_clock -period 3.333 [get_ports sys_clk_p]
#create_clock -period 3.333 [get_ports sys_clk_p]
  
####################

 # DOUT constraints
 # IO Standard
 set_property IOSTANDARD LVDS [get_ports dout*]
 # DOUT from bank 1
 set_property PACKAGE_PIN AF5 [get_ports dout_tx_n_0]
 set_property PACKAGE_PIN AE5 [get_ports dout_tx_p_0]
# # DOUT from bank 2
 set_property PACKAGE_PIN Y3 [get_ports dout_rx_n_0]
 set_property PACKAGE_PIN Y4 [get_ports dout_rx_p_0]

####################

 # FCO constraints
 # IO Standard
set_property IOSTANDARD LVDS [get_ports fco*]
 # FCO from bank 1
 set_property PACKAGE_PIN P9 [get_ports fco_tx_n_0]
 set_property PACKAGE_PIN P10 [get_ports fco_tx_p_0]
 # FCO from bank 2
 set_property PACKAGE_PIN R8 [get_ports fco_rx_n_0]
 set_property PACKAGE_PIN T8 [get_ports fco_rx_p_0]

####################

 # DCO constraints
 # IO Standard
 set_property IOSTANDARD LVDS [get_ports dco*]
 # DCO from bank 1
 set_property PACKAGE_PIN AF7 [get_ports dco_tx_n_0]
 set_property PACKAGE_PIN AE7 [get_ports dco_tx_p_0]
 # DCO from bank 2
 set_property PACKAGE_PIN AA6  [get_ports dco_rx_n_0]
 set_property PACKAGE_PIN AA7  [get_ports dco_rx_p_0]

```

The user guide for the ZCU102 is found here https://docs.amd.com/v/u/en-US/ug1182-zcu102-eval-bd.

Finally, you can now run ```Generate Bitstream``` under ```PROGRAM AND DEBUG```. This should take some time. After this is complete, You should now be able to generate the hardware files by navigating and running ```File -> Export -> Export Hardware``` and checking the box ```Include bitstream```. Store this in a new folder named ```hw``` in your project directory ```~/working/directory/hw```. 
# Generating the Petalinux Image 

In this project, I used petalinux 2023.2 (compatible with Cern's Caribou set up). Petalinux is a streamlined way for us to generate minimal linux images based on the hardware architecture of the PL system. We could also program the devices using baremetal programs, which operate without an operating system, however using linux allows us more customization to the hardware and gives us a way to network through SSH into the fpga and run custom C and python applications. The usual work flow is bringing up hardware through baremetal programs anf then integrating linux. However, for simplicity, I will jump straight to the linux generation.

After installing petalinux, we first want to set up the shell environment so that the petalinux tools can be used: 
```user@computer: ~/working/directory$ source /path/to/petalinux/2023.2/settings.sh```

We can then generate a petalinux project by going into our Vivado project and running

```user@computer: ~/working/directory$ petalinux-create --type project --name os --template zynqMP```

The template tag generates the tools for a starter project based on the Zynq Ultrascale Plus MPSoC. We can then move into our directory and configure the hardware.

```user@computer: ~/working/directory/os/$ petalinux-create --type project --name os --template zynqMP```

We now have to set the hardware for our project, by running 

```user@computer: ~/working/directory/os/$ petalinux-config --get-hw-description /path/to/exported/hardware/hw.xsa```

The following menu will appear. We will  want to go into Image Packaging Configuration and change the Root filesystem type to EXT4 for permenant storage one the SD card. Also make sure to enable ```FPGA Manager```.

![](/public/images/digital_oscilloscope/step_1_petalinux.png)

![](/public/images/digital_oscilloscope/step_2_petalinux.png)

Now, we will want to add the kernel driver so that the userspace on the linux system can directly read and write to the memory through our direct memory access module. First, run 

```user@computer: ~/working/directory/os/$ petalinux-create --type modules --name u-dma-buf --enable```

Move into the module directory:

```user@computer: ~/working/directory/os/$ cd project-spec/meta-user/recipes-modules/u-dma-buf/files/```

Using a text editor, copy Makefile, u-dma-buf.c, and u-dma-buf-ioctl.h from https://github.com/ikwzm/udmabuf/blob/master/ into this directory. These files will generate the Linux device drivers needed to give the userspace access to memory adjacent in both virtual and physical memory for direct memory access. We will now configure the device tree by editing the following file in the board support package:

```user@computer: ~/working/directory/os/$ vim project-spec/meta-user/recipes-bsp/device-tree/files/system-user.dtsi```

Replace the file with the following
```
/include/ "system-conf.dtsi"

/ {
udmabuf@0x00 {
        compatible = "ikwzm,u-dma-buf";
        device-name = "udmabuf0";
        minor-number = <0>;
        size = <0x4000000>;
        sync-mode = <1>;
        sync-always;
	};

};

&amba {
    dma@80000000 {
	    compatible = "generic-uio";
	};
};

&sdhci0 {
	no-1-8-v;
	disable-wp;
};

```
udmabuf creates a userspace DMA buffer driver instance and dma@80000000 gives the userspace access to the DMA block. This exposes a contiguous DMA-capable memory buffer to userspace as /dev/udmabuf0. If the dma has a different address in the Vivado design, make sure to replace dma@80000000 with dma@< DMA address >.

Lastly, we want to include python as part of our image to run some scripts. We can do this by editting the root file system:
```user@computer: ~/working/directory/os/$ petalinux-config -c rootfs ``` and enabling python3 in Filesystem Packages -> misc -> python3 -> python3. 

With all of the configurations complete, we can build the image.
```user@computer: ~/working/directory/os/$ petalinux-build ```

I've noticed that some nondetrimental errors can occur with the shared state cache (sstate cache) in the first build. Thus, petalinux will spit out an error, however you can just simply run the build again and the image should be built in  ```~/working/directory/os/images/linux ```. The first build will take quite a bit of time, but the second one will have the sstate cache available to it and should run much quicker.

Now we need to package the image so that it is bootable on the sd card. We can do this by running 

```user@computer: ~/working/directory/os/$ petalinux-package --boot --u-boot --fpga --fsbl ```

> If you rebuild the image, run ```user@computer: ~/working/directory/os/ petalinux-package --force --boot --u-boot --fpga --fsbl ``` to override old files

Finally, we can package this into a wic file, which we can then flash onto the sd card:

```user@computer: ~/working/directory/os/$ petalinux-package --wic ```
```user@computer: ~/working/directory/os/$ sudo dd if=images/linux/petalinux-sdimage.wic of=/dev/sdX bs=4M status=progress```

> similar to building the image, I've notices that the first wic image packaging might not succeed first try, so just simply rerun it if this is the case

We can now interface with the device by connecting to some serial port and communicating through UART. I ran GTKterm and connected to /dev/ttyUSB0 at 115200 Baud Rate.

![](/public/images/digital_oscilloscope/step_3_petalinux.png)

After Linux finishes booting, enter the username ```petalinux``` and follow the prompts to enter in a new password. We can see that the DMA buffer is available to the user space:
![](/public/images/digital_oscilloscope/step_4_petalinux.png)

We can also set up SSH by running  
``` petalinux: ~$ ip addr ```
and setting connecting from the host machine:
```user@computer: ~/working/directory$ ssh petalinux@< insert ip address > ```,
which will be convienent for using scp to copy and move files between machines. 

A useful tool that petalinux comes with is ```fpgautil```. which we can use to load and reload various fpga designs. Before running any scripts, we want to first check to see if our PL design is loaded into the board. We can do this by running 
``` petalinux: ~$ cat /sys/class/fpga_manager/fpga0/state ```
![](/public/images/digital_oscilloscope/step_5_petalinux.png)

If the fpga is not operating or the state of the fpga is unknown, then we will have to load our design back into the fpga. We can do this by going to the host machine and obtaining the bit file of our design

```user@computer: ~/working/directory$ scp ./project_name.runs/impl_1/*.bit petalinux@< insert ip address >```

On the board, we can now run 
``` petalinux: ~$ sudo fpgautil -b < bit file name>.bit ```

This should create the directory ```/lib/firmware/``` which is where you can store the bit file 

``` petalinux: ~$ sudo cp < bit file name>.bit /lib/firmware ```

Now run 
``` petalinux: ~$ cat /sys/class/fpga_manager/fpga0/state ```
which should now output ```operating``` if it was not before. You can use these exact same process for also loading new hardware designs, as long as the interface to the processing system in your Vivado design does not change. 
# Python Script to Access Memory
We can program the S2MM stream register by referring to this document 
https://docs.amd.com/r/en-US/pg021_axi_dma/S2MM_DMACR-S2MM-DMA-Control-Register-Offset-30h. By running certain commands, we can allow data to stream into memory and read from memory into the processing system. This is the python script that we can use to test get some data points (generated by ChatGPT)

```
import os
import mmap
import struct
import numpy as np
import time

# ============================================================
# DMA CONFIG
# ============================================================
DMA_BASE = 0x80000000

S2MM_DMACR  = 0x30
S2MM_DMASR  = 0x34
S2MM_DA     = 0x48
S2MM_LENGTH = 0x58

NUM_WORDS = 64
BUF_SIZE = NUM_WORDS * 4
NUM_TRANSFERS = 10

# ============================================================
def wr32(mm, off, val):
    mm[off:off+4] = struct.pack("<I", val)

def rd32(mm, off):
    return struct.unpack("<I", mm[off:off+4])[0]

# ============================================================
fd = os.open("/dev/mem", os.O_RDWR | os.O_SYNC)
mm = mmap.mmap(fd, 0x1000,
               mmap.MAP_SHARED,
               mmap.PROT_READ | mmap.PROT_WRITE,
               offset=DMA_BASE)

print("Resetting DMA...")
wr32(mm, S2MM_DMACR, 0x4)
wr32(mm, S2MM_DMACR, 0x0)
wr32(mm, S2MM_DMACR, 0x1)

fd_buf = os.open("/dev/udmabuf0", os.O_RDONLY)

# ============================================================
all_data = []
prev_capture = None
kept = 0

print("Starting capture...\n")

for i in range(NUM_TRANSFERS):

    wr32(mm, S2MM_DA, 0x6BC00000)
    wr32(mm, S2MM_LENGTH, BUF_SIZE)

    # wait for DMA done
    while True:
        status = rd32(mm, S2MM_DMASR)

        if status & 0x1000:
            break

        if status & 0x0001:
            print(f"DMA ERROR: 0x{status:08X}")
            break

    # read buffer
    os.lseek(fd_buf, 0, os.SEEK_SET)
    data = os.read(fd_buf, BUF_SIZE)

    capture = np.frombuffer(data, dtype=np.uint32)

    # ========================================================
    # DEDUPLICATION CHECK
    # ========================================================
    if prev_capture is not None and np.array_equal(capture, prev_capture):
        print(f"Transfer {i}: duplicate → skipped")
        continue

    prev_capture = capture.copy()
    all_data.append(capture)

    print(f"Transfer {i}: kept")

    kept += 1

    time.sleep(0.05)

# ============================================================
# SAVE ONLY UNIQUE CAPTURES
# ============================================================
all_data = np.array(all_data, dtype=np.uint32)
np.save("dma_capture_all.npy", all_data)

print(f"\nSaved {kept} unique transfers to dma_capture_all.npy")

# cleanup
os.close(fd_buf)
mm.close()
os.close(fd)
```

To run the python script, we have to check the physical address of the buffer. We can check this by running

``` petalinux: ~$ cat /sys/class/u-dma-buf/udmabuf0/phys_addr ```.

Make sure to replace ```BUF_ADDR``` with the output of this command. You should now get a file ```dma_capture_all.npy```, which can be plotted out:

![](/public/images/digital_oscilloscope/dma_capture.png)


# Next Steps
There are a couple of corners that I haven't fully worked out with the design at the moment. First, the deserialization module needs a more robust infrastructure to ensure that bits are aligned and not corrupted. One document that I found that would be a strong reference for improving this design is https://docs.amd.com/v/u/en-US/xapp524-serial-lvds-adc-interface. For instance, below is a demonstration of the integrated ILA on a full OSERDES and ISERDES implementation. We can see the general shape of the pulse, but there is clearly some poor bit alignment.
![](/public/images/digital_oscilloscope/step_1_next_steps.png)

Next, the DMA data streaming is not continuous, due to the simple DMA IP block that we are using. For a more robust and consistent data capture, there are a few options for allowing for continuous data streaming. For example, enabling scatter gather, cyclic dma mode, or implementing two DMAs (one for reading, one for writing) are all designs that would be worth exploring. Some useful resources for implementing this, I have found, are here https://docs.amd.com/r/en-US/pg021_axi_dma/Scatter/Gather-Mode.

The goal would to fully implement this block design to allow continuous data streaming from any ADC interface.
![](/public/images/digital_oscilloscope/step_2_next_steps.png)