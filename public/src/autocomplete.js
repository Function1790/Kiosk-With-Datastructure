const input = document.getElementById('input')
const result = document.getElementById('result')

function sendAjax(searchWord) {
	$.ajax({
		type: "post",
		headers: {
			"Content-Type": "application/json",
			"X-HTTP-Method-Override": "POST"
		},
		url: '/autocomplete',
		data: JSON.stringify({ search: searchWord }),
		dataType: 'json',
		success: function (res) { // 응답이 왔을 경우
			const words = res.words
			var HTML = ''
			for (var i in words) {
				HTML += `<div class="word">${words[i]}</div>`
			}
			result.innerHTML = HTML
		}
	});
}

input.addEventListener('keyup', () => {
	sendAjax(input.value)
})