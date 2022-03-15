class FormCPM {
    all_count
    form
    addFormRow
    formBody
    removeRow
    rowTemplate = [
        {'el': 'input', 'name': 'name', 'class': 'w-100 form-control', 'type': 'text', 'placeholder': 'Nazwa...'},
        {'el': 'input', 'name': 'durationInHours', 'value': '0', 'class': 'w-100 form-control',  'min': '0', 'step': '1', 'type': 'number', 'placeholder': 'Czas trwania'},
        {'el': 'input', 'name': 'start', 'class': 'w-100 form-control', 'type': 'datetime-local', 'placeholder': 'Początek...', 'value': this.getNowDateStr()},
        {'el': 'input', 'name': 'predecessors', 'class': 'w-100 form-control', 'type': 'text', 'placeholder': 'Poprzednicy'},
    ]

    init() {
        this.all_count = 0
        this.form = document.getElementById("form-cpm")
        this.addFormRow = document.getElementById("add-form-row")
        this.formBody = document.getElementById("form-body")
        this.removeTableRow = document.querySelectorAll(".remove-form-row")

        if(!this.form || !this.addFormRow || !this.formBody) {
            throw new DOMException("Brak form, add-form-row, form-body")
        }

        this.bindEvents()
    }

    bindEvents() {
        this.addFormRow.addEventListener('click', e => {
            this.addRow()
        }, false)

        this.removeTableRow.forEach(item => {
            item.addEventListener('click', e => {
                this.removeTableRow(item)
            }, false)
        })

        this.form.addEventListener('submit', e => {
            this.sendData(e)
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
        btn.addEventListener('click', e => {
            btn.closest('tr').remove()
        }, false)
        td_2.append(btn)
        tr.append(td_2)

        this.all_count ++
        this.formBody.append(tr)
    }

    getNowDateStr() {
        const d = new Date()
        return `${d.getFullYear()}-${('00' + (d.getMonth() + 1)).slice(-2)}-${('00' + d.getDate()).slice(-2)}T00:00`
    }

    removeTableRow(element) {
        element.closest('tr').remove()
    }


    sendData(e) {
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

        const form = document.createElement('form')
        form.action = this.form.action
        form.method = "POST"
        form.classList.add('d-none')

        const i = document.createElement('input')
        i.name = 'data'
        i.value = json

        form.append(i)

        document.body.append(form)
        form.submit()
    }
}


const formCpm = new FormCPM()
document.addEventListener('DOMContentLoaded', e => {
    formCpm.init()
}, false)