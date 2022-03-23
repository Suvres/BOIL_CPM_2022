class FormCPM {
    networkData
    all_count
    form
    addFormRow
    formBody
    removeRow
    networkGraph
    network = null
    error
    networkOptions = {
        layout: {
            randomSeed: 1,
            hierarchical: {
                enabled:false,
                levelSeparation: 150,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'LR',
                sortMethod: 'directed',  // hubsize, directed
                shakeTowards: 'roots'  // roots, leaves
            }
        }
    }
    rowTemplate = [
        {'el': 'input', 'name': 'name', 'class': 'w-100 form-control', 'type': 'text', 'placeholder': 'Nazwa...'},
        {'el': 'input', 'name': 'durationInHours', 'value': '0', 'class': 'w-100 form-control',  'min': '0', 'step': '1', 'type': 'number', 'placeholder': 'Czas trwania'},
        {'el': 'input', 'name': 'predecessors', 'class': 'w-100 form-control', 'type': 'text', 'placeholder': 'Poprzednicy'},
    ]

    init() {
        this.all_count = 0
        this.form = document.getElementById("form-cpm")
        this.addFormRow = document.getElementById("add-form-row")
        this.formBody = document.getElementById("form-body")
        this.removeTableRow = document.querySelectorAll(".remove-form-row")
        this.removeTableRow = document.querySelectorAll(".remove-form-row")
        this.networkGraph = document.getElementById("network-graph")
        this.error = document.getElementById("error")

        if(!this.form || !this.addFormRow || !this.formBody || !this.error) {
            throw new DOMException("Brak form, add-form-row, form-body, error")
        }

        this.testNodes()

        this.bindEvents()
    }

    bindEvents() {
        this.addFormRow.addEventListener('click', () => {
            this.addRow()
        }, false)

        this.removeTableRow.forEach(item => {
            item.addEventListener('click', () => {
                this.removeTableRow(item)
            }, false)
        })

        this.form.addEventListener('submit', async e => {
            await this.sendData(e)
        })
    }

    addRow() {
        const tr = document.createElement('tr')

        const td_1 = document.createElement('td')
        td_1.innerText = `${this.all_count + 1}`
        tr.append(td_1)

        this.rowTemplate.forEach(item => {
            const td = document.createElement('td')
            const input = document.createElement(item['el'])

            Object.entries(item).forEach(([key, value]) => {
                if (key !== 'el') {
                    input.setAttribute(key, value)
                }

                if (key === 'name') {
                   input.setAttribute('name', `${this.all_count}_${value}`)
                }
            })

            td.append(input)
            tr.append(td)
        })

        const td_2 = document.createElement('td')
        const btn = document.createElement('button')
        btn.setAttribute('class', 'w-100 btn btn-danger remove-form-row fw-bolder')
        btn.setAttribute('type', 'button')
        btn.innerText = '-'
        btn.addEventListener('click', () => {
            btn.closest('tr').remove()
        }, false)
        td_2.append(btn)
        tr.append(td_2)

        this.all_count ++
        this.formBody.append(tr)
    }

    removeTableRow(element) {
        element.closest('tr').remove()
    }


    async sendData(e) {
        e.preventDefault()

        let object = [];
        (new FormData(this.form)).forEach((value, key) => {
            const keys = key.split('_')
            if(object[parseInt(keys[0])] === undefined) {
                object[keys[0]] = {}
            }

            if(value.search(/[,;]/) !== -1) {
                value = value.split(/[,;]/)
            } else if (keys[1] === 'predecessors' && value.trim() !== '') {
                value = [value.trim()]
            }

            if((value instanceof String || typeof value === 'string') && value.trim() === '' && keys[1] === 'predecessors') {
                value = []
            }
            object[keys[0]][keys[1]] = value
        });
        const json = JSON.stringify(object);

        await this.sendPost(json)
    }

    async sendPost(json) {
        let response
        try {
            response = await fetch('/calculate', {
                body: json,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                this.error.classList.add('show')
            })
        } catch (e) {
            this.error.classList.add('show')
        }

        if(response.ok) {
            const json = await response.json()
            this.createGraph(json)
        } else {
            this.error.classList.add('show')
        }
    }

    createGraph(object) {
        let [nodes, edges] = this.getDataSet(object)
        let ids = []
        let ed = []
        nodes = nodes.filter( value => {
            if(!ids.includes(value['id'])) {
                ids.push(value['id'])
                return true
            }

            return false
        })

        edges = edges.filter( value => {

            if(ed.length === 0) {
                ed.push({from: value['from'], to: value['to']})
                return true
            }

            let ex = false
            ed.forEach( item => {
                if(item['to'] === value['to'] && item['from'] === value['from']) {
                    ex = true
                }
            })

            if(!ex) {
                ed.push({from: value['from'], to: value['to']})
                return true
            }

            return false
        })

        this.networkData = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        }

        this.drawNetwork()
    }

    getDataSet(json) {
        let data = [[], []];
        data[0][0] = {}
        data[0][0]['id'] = json['id']
        data[0][0]['label'] = `${json['id']}`

        json['actionsOut'].forEach(row => {
            if(row['endNode'] !== null) {
                let object = {}
                object['from'] = json['id']
                object['label'] = `${row['name']} ${row['durationInHours']}`
                object['to'] = row['endNode']['id']
                object['arrow'] = { to: { enabled: true, type: 'arrow'}}
                if(object['label'].includes('Virtual')) {
                    object['dashes'] = true
                }

                const tmp_dataset = this.getDataSet(row['endNode'])
                data[0] = [...data[0], ...tmp_dataset[0]]
                data[1] = [...data[1], object, ...tmp_dataset[1]]
            }
        })

        return data
    }

    drawNetwork() {
        this.destroyGraph()
        this.network = new vis.Network(this.networkGraph, this.networkData, this.networkOptions);
    }

    destroyGraph() {
        if(this.network !== null) {
            this.network.destroy()
            this.network = null
        }
    }

    testNodes() {

        // create an array with nodes
        const nodes = new vis.DataSet([
            { id: 1, label: "Node 1" },
            { id: 2, label: "Node 2" },
            { id: 3, label: "Node 3" },
            { id: 4, label: "Node 4" },
            { id: 5, label: "Node 5" },
        ]);

        // create an array with edges
        const edges = new vis.DataSet([
            { from: 1, to: 3 },
            { from: 1, to: 2 },
            { from: 2, to: 4 },
            { from: 2, to: 5 },
            { from: 3, to: 3 },
        ]);

        // create a network
        const data = {
            nodes: nodes,
            edges: edges,
        };
        const options = {};
        new vis.Network(this.networkGraph, data, options);
    }
}


const formCpm = new FormCPM()
document.addEventListener('DOMContentLoaded', () => {
    formCpm.init()
}, false)