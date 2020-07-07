chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        let today = new Date();
        document.getElementById("date").innerHTML = today.toLocaleString();

        exp = /(data-sort-key=".*?")/g;
        var ul = document.getElementById("list");
        document.getElementById("total").innerHTML = request.source.match(exp).length;
        request.source.match(exp).forEach(element => {
            exp_name = /(?<=").+(?=\s)/g;
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(element.match(exp_name)));
            li.setAttribute("class", "list-group-item");
            ul.appendChild(li);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('save');
    btn.addEventListener('click', function () {
        var desc = new Array();

        $("#list").find('.list-group-item').each(function () {
            var elem = $(this).text().trim();
            desc.push(elem);
        });

        var csvContent = desc.join(",\n");
        var pom = document.createElement('a');
        var blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        pom.href = url;
        let today = new Date();
        let date = (today.getMonth() + 1) + '월' + today.getDate() + '일' + today.getHours() + '시' + today.getMinutes() + '분';
        pom.setAttribute('download', date + '.csv');
        pom.click();
    });
});

function onWindowLoad() {
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function () {
        if (chrome.runtime.lastError) {
            document.getElementById("total-text").style.display = "none";
            document.getElementById("user-list").style.display = "none";
            document.getElementById("save-btn").style.display = "none";
            message.innerText = 'Google Meet에서 접속해주세요!!\n' + chrome.runtime.lastError.message;
        }
    });
}

window.onload = onWindowLoad;