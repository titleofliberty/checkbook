/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

$('tbody').sortable({
    stop: function(evnet, ui) {
        tallyBalance()
    }
})

document.getElementById('linkMode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('linkMode').innerHTML = isDarkMode ? '<i class="bi bi-moon"></i>' : '<i class="bi bi-brightness-high"></i>'
})

document.getElementById('linkInsert').addEventListener('click', async () => {
    var today = moment().format('YYYY-MM-DD')
    const desc = await window.lookups.descriptions()
    const cats = await window.lookups.categories()

    $('#transactionModal').modal('toggle')
    $('#textDate').val(today)
    $('#textDescription').val('')
    $('#textCategory').val('')
    $('#buttonCleared').prop('checked', false)
    $('#buttonDebit').prop('checked', true)
    $('#textAmount').val('')
    $('#textIdx').val('')

    var dlst = $('#datalistDescription')
    $(dlst).html("")
    desc.forEach(element => {
        $(dlst).append('<option value="' + element + '">')
    })

    var clst = $('#datalistCategory')
    $(clst).html("")
    cats.forEach(element => {
        $(clst).append('<option value="' + element + '">')
    })
    
})

$('#buttonSave').click(() => {
    var idx = $('#textIdx').val()

    if (idx == '') {
        var idx = getNextIdx()
        var html = "<tr id='rec-" + idx + "' class='record'>"
        html += buildRecord(idx)
        html += "</tr>"
        $('tbody').prepend(html)
    }
    else {
        $('#rec-' + idx).html(buildRecord(idx))
    }
    $('#transactionModal').modal('toggle')
    tallyBalance()
})

function buildRecord(idx) {
    var html = "<td id='date-" + idx + "'>" + $('#textDate').val() + "</td>"
    html += "<td id='desc-" + idx + "'>" + $('#textDescription').val() + "</td>"
    html += "<td id='cat-" + idx + "'>" + $('#textCategory').val() + "</td>"
    if ($('#buttonCleared').is(':checked')) {
        html += "<td id='clr-" + idx + "'><i class='bi bi-check' style='color: green;'></i></td>"
    }
    else {
        html += "<td id='clr-" + idx + "'>&nbsp;</td>"
    }
    var amt = parseFloat($('#textAmount').val());
    if ($('#buttonCredit').is(':checked')) {
        if (amt < 0) { amt = amt * -1 }
        html += "<td id='amt-" + idx + "' class='amount'>" + amt.toFixed(2) + "</td>"
    }
    else {
        if (amt > 0) { amt = amt * -1 }
        html += "<td id='amt-" + idx + "' class='amount'>" + amt.toFixed(2) + "</td>"
    }
    html += "<td id='bal-" + idx + "' class='balance'></td>"
    html += "<td class='text-center'><a href='#' onclick='editRecord(" + idx + ")'><i class='bi bi-pencil me-3'></i></a>"
    html += "<a href='#' onclick='deleteRecord(" + idx + ")'><i class='bi bi-trash'></i></a></td>"
    return html
}

function tallyBalance() {
    var balances = $('.balance');
    var amounts = $('.amount')
    var balance = 0;

    for (i = amounts.length - 1; i >= 0; i--) {
        var amt = parseFloat($(amounts[i]).html())
        balance += amt
        $(balances[i]).html(balance.toFixed(2))
    }
}

function editRecord(idx) {
    $('#textDate').val($('#date-' + idx).html())
    $('textDescription').val($('#desc-' + idx).html())
    $('textCategory').val($('#cat-' + idx).html())
    if ($('#clr-' + idx).html() != '') {
        $('buttonCleared').prop('checked', true)
    }
    else {
        $('buttonCleared').prop('checked', false)
    }
    var amt = parseFloat($('#amt-' + idx).html())
    if (amt > 0) {
        $('#buttonCredit').prop('checked', true)
    }
    else {
        $('#buttonDebit').prop('checked', true)
    }
    $('textAmount').val($('#amt-' + idx).html())
    $('#textIdx').val(idx)
    $('#transactionModal').modal('toggle')

    var dlst = $('#datalistDescription')
    $(dlst).html("")
    desc.forEach(element => {
        $(dlst).append('<option value="' + element + '">')
    })

    var clst = $('#datalistCategory')
    $(clst).html("")
    cats.forEach(element => {
        $(clst).append('<option value="' + element + '">')
    })
}

function deleteRecord(idx) {
    var rec = $('#rec-' + idx)
    var desc = $('#desc-' + idx).html()
    var amt = $('#amt-' + idx).html()
    if (confirm("Permanently delete record: " + desc + " for " + amt + "?")) {
        $(rec).remove()
    }
}

function getNextIdx() {
    var i = parseInt($('tbody').data('idx'))
    var j = i + 1
    $('tbody').data('idx', j)
    return i.toString()
}

$('#linkNew').click(async () => {
    const filePath = await window.electronAPI.saveFile()
    document.title = "Checkbook [" + filePath + "]"
    $('tbody').data('file', filePath)
    $('tbody').html('')
})

$('#linkOpen').click(async () => {
    const filePath = await window.electronAPI.openFile()
    document.title = "Checkbook [" + filePath + "]"
    $('tbody').data('file', filePath)
})

$('#linkSave').click(async () => {
    const filePath = await window.electronAPI.saveFile()
    document.title = "Checkbook [" + filePath + "]"
    $('tbody').data('file', filePath)
})
