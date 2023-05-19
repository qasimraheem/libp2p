import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'

const main = async () => {
    const node = await createLibp2p({
        addresses: {
            // add a listen address (localhost) to accept TCP connections on a random port
            listen: ['/ip4/0.0.0.0/tcp/2202']
        },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()]
    })

    // start libp2p
    await node.start()
    console.log('libp2p has started')

    // print out listening addresses
    console.log('listening on addresses:')
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    })


    // ping peer if received multiaddr
    if (process.argv.length >= 3) {
        const ma = multiaddr(process.argv[2])
        console.log(`pinging remote peer at ${process.argv[2]}`)
        const latency = await node.ping(ma)
        console.log(`pinged ${process.argv[2]} in ${latency}ms`)
    } else {
        console.log('no remote peer address given, skipping ping')
    }


    const stop = async () => {
        // stop libp2p
        await node.stop()
        console.log('libp2p has stopped')
        process.exit(0)
    }

    process.on('SIGTERM', stop)
    process.on('SIGINT', stop)


    // stop libp2p
    // await node.stop()
    // console.log('libp2p has stopped')
}

main().then().catch(console.error)
