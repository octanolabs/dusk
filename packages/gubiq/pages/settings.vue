<template>
  <v-layout>
    <v-col :cols="12" class="pa-2">
      <v-flex column xs12>
        <v-card tile class="mb-4 pa-4 w100">
          <v-flex column xs12 d-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select v-model="client" :items="clients" label="Client" />
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select v-model="version" :items="versions" label="Version" />
            </v-flex>
          </v-flex>
          <v-flex column xs12 d-block>
            <v-text-field
              v-model="nodename"
              :rules="nameRules"
              :counter="32"
              label="Name"
              required
            />
          </v-flex>
          <v-flex column xs12 d-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select v-model="network" :items="networks" label="Network" />
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-text-field v-model="port" label="Port" required />
            </v-flex>
          </v-flex>
          <v-flex column xs12 d-flex>
            <v-flex xs12 sm6>
              <v-select v-model="peers" :items="maxpeers" label="Max peers" />
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select v-model="cache" :items="dbcache" label="Cache (MB)" />
            </v-flex>
          </v-flex>
        </v-card>
        <v-flex xs12 sm12 d-inline-block>
          <v-card tile class="mb-4 pa-4 w100">
            <div>
              <h3 class="headline mb-0">
                syncmode
              </h3>
              <p>Blockchain sync mode</p>
              <v-radio-group v-model="syncmode" @change="onSyncmodeChange" row>
                <v-radio label="Fast" value="fast" />
                <v-radio label="Full" value="full" />
              </v-radio-group>
              <p v-if="syncmode === 'full'">
                Synchronizes a full node starting at genesis performing full
                validation and executing all transactions. This mode is a slower
                than the fast sync mode but comes with increased security.
              </p>
              <p v-else>
                Synchronizes a fast syncing through state downloads rather than
                downloading the full block data. This will also reduce the size
                of your blockchain dramatically. NOTE: --fast can only be run if
                you are syncing your blockchain from scratch and only the first
                time you download the blockchain for security reasons. See this
                Reddit post for more information.
              </p>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 d-inline-block>
          <v-card tile class="mb-4 pa-4 w100">
            <div>
              <h3 class="headline mb-0">
                gcmode
              </h3>
              <p>Blockchain garbage collection mode</p>
              <v-radio-group
                v-model="gcmode"
                :disabled="syncmode !== 'full'"
                row
              >
                <v-radio label="Full" value="full" />
                <v-radio label="Archive" value="archive" />
              </v-radio-group>
              <p v-if="gcmode === 'archive'">
                Synchronizes an archive node starting at genesis, thoroughly
                verifying all blocks, executing all transactions, and writing
                all intermediate states to disk ("archive").
              </p>
              <p v-else>
                Enables fast syncing through state downloads rather than
                downloading the full block data. This will also reduce the size
                of your blockchain dramatically. NOTE: --fast can only be run if
                you are syncing your blockchain from scratch and only the first
                time you download the blockchain for security reasons. See this
                Reddit post for more information.
              </p>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 d-inline-block>
          <v-card tile class="mb-4 pa-4 w100">
            <div>
              <h3 class="headline mb-0">
                RPC
              </h3>
              <p>Enable the HTTP-RPC server</p>
              <v-switch v-model="rpc" inset />
              <p>
                Please note, offering an API over the HTTP (rpc) interface will
                give everyone access to the APIs who can access this interface
                (DApps, browser tabs, etc). Be careful which APIs you enable.
              </p>
              <v-layout row wrap justify-space-between>
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="admin"
                  value="admin"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="db"
                  value="db"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="debug"
                  value="debug"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="eth"
                  value="eth"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="miner"
                  value="miner"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="net"
                  value="net"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="personal"
                  value="personal"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="txpool"
                  value="txpool"
                />
                <v-checkbox
                  v-model="rpcApis"
                  :disabled="rpc !== true"
                  label="web3"
                  value="web3"
                />
              </v-layout>
            </div>
          </v-card>
        </v-flex>
      </v-flex>
    </v-col>
  </v-layout>
</template>

<script>
export default {
  middleware: 'auth',
  props: {
    display: Boolean
  },
  data: () => ({
    nodename: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 32 || 'Name must be less than 32 characters'
    ],
    clients: ['Gubiq'],
    datadir: '',
    port: '30388',
    client: '',
    version: '',
    networks: ['mainnet', 'testnet'],
    network: '',
    syncmode: 'fast',
    gcmode: 'full',
    rpc: false,
    rpcApis: ['db', 'eth', 'net', 'web3'],
    dbcache: ['16', '32', '64', '128', '256', '512', '1024', '2048'],
    cache: '',
    maxpeers: ['25', '50', '100', '200', '300', '400', '500'],
    peers: ''
  }),
  computed: {
    versions() {
      return []
    },
    defaultDatadir() {
      return '/home/xocel/.ubiq'
    }
  },
  created() {
    this.version = this.versions[0]
    this.network = this.networks[0]
    this.peers = this.maxpeers[0]
    this.cache = this.dbcache[0]
    this.datadir = this.defaultDatadir
  },
  methods: {
    onSyncmodeChange() {
      if (this.syncmode === 'fast') {
        this.gcmode = 'full'
      }
    }
    /* saveNode() {
      const nid = Date.now().toString(16)
      const newNode = {
        name: this.nodename,
        remote: false,
        location: 'localhost',
        client: 'gubiq',
        version: this.version,
        datadir: this.datadir,
        network: this.network,
        port: this.port,
        maxpeers: this.peers,
        cache: this.cache,
        syncmode: this.syncmode,
        gcmode: this.gcmode,
        rpc: this.rpc,
        rpcApis: this.rpcApis
      }
      //this.$store.dispatch('addNode', { id: nid, node: newNode })
      //this.$emit('closeDialog')
    } */
  }
}
</script>
