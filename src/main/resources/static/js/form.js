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
        groups: {
            cpm: {color:{background:'red'}, font: {color: 'white'}},
        },
        physics: {
            enabled: false
        },
        layout: {
            randomSeed: 1,
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

        object = this.normalizeSendObject(object)
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
        nodes = this.compactNode(nodes)
        edges = edges.filter(this.edgeFilter(ed))

        console.log(edges)
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
        data[0][0]['margin'] = '10px'
        if (json['id'] >= 0) {
            data[0][0]['label'] = `${json['id']}`
        }

        json['actionsOut'].forEach(row => {
            if(row['endNode'] !== null) {
                let object = {}
                object['from'] = json['id']
                object['to'] = row['endNode']['id']
                object['arrows'] = { to: { enabled: true, type: 'arrow'}}
                if(row['name'].includes('Virtual')) {
                    object['dashes'] = true
                } else {
                    object['label'] = `${row['name']} ${row['durationInHours']}`
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
            { fixed: { x:true, y:true }, id: 1, label: "Node 1", group: 'cpm'},
            { id: 2, label: "Node 2", group: 'cpm' },
            { id: 3, label: "Node 3", group: 'cpm' },
            { id: 4, label: "Node 4" },
            { id: 5, label: "Node 5"},
            { id: 6, label: "Node 6", group: 'cpm'},
            { id: 7, label: "Node 7", group: 'cpm'},
            { id: 8, label: "Node 8", group: 'cpm'},
            { id: 9, label: "Node 9"},
            { id: 10, label: "Node 10", group: 'cpm'},
            { id: 11, label: "Node 11", group: 'cpm'},
        ]);

        // create an array with edges
        const edges = new vis.DataSet([
            {from: 1, to: 2, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
            {from: 2, to: 3, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
            {from: 2, to: 4, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 4, to: 5, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 3, to: 6, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
            {from: 5, to: 9, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 3, to: 5, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 9, to: 7, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 6, to: 7, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
            {from: 7, to: 8, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
            {from: 8, to: 9, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 9, to: 10, arrows: {to: { enabled: true, type: 'arrow'}} },
            {from: 8, to: 10, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red'},
            {from: 10, to: 11, arrows: {to: { enabled: true, type: 'arrow'}}, color: 'red' },
        ]);

        // create a network
        const data = {
            nodes: nodes,
            edges: edges,
        };
        new vis.Network(this.networkGraph, data, this.networkOptions);
    }

    edgeFilter(ed) {
        return value => {
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
        }
    }

    compactNode(nodes) {
        let _nodes = []
        nodes.forEach(item =>{
            let ex = false

            _nodes.forEach((v, k) => {
                if(v['id'] === item['id'])
                {
                    ex = true
                    if(v['level'] < item['level']) {
                        _nodes[k] = item
                    }
                }
            })

            if(!ex) {
                _nodes.push(item)
            }
        })

        return _nodes
    }

    normalizeSendObject(object) {
        let _tmp = [];
        object.forEach(item => {
            if(item !== null) {
                _tmp.push(item)
            }
        })

        return _tmp
    }
}


const formCpm = new FormCPM()
document.addEventListener('DOMContentLoaded', () => {
    formCpm.init()
}, false)