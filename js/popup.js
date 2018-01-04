$(function(){
	debugger;
	var chkAlertPrice = $("[name='my-checkbox']");
	chkAlertPrice.bootstrapSwitch({onColor: 'warning', size: 'mini'});

	chkAlertPrice.on('switchChange.bootstrapSwitch', function(event, state) {
		if(state){
			$(".alertPrice").show();
		}
		else{
			$(".alertPrice").hide();
		}
	});
	
	$("#alertPrice").change(function(){
		chrome.storage.sync.set({'alertPrice': $(this).val()}, function(){
			var notification = {
				type: 'basic',
				iconUrl: 'img/bitcoinIcon48.png',
				title: 'Alert Set!',
				message: 'The alert for Bitcoin is set. You will be notify when the price reach the value.'
			};
			chrome.notifications.create("setBitAlertNotify", notification);
		});
	});
	
	chrome.storage.sync.get(['alertPrice'], function(prices){
		$("#alertPrice").val(prices.alertPrice);
		console.log(prices.alertPrice);
	})
	//^\$?(?!0.00)(([0-9]{1,3},([0-9]{3},)*)[0-9]{3}|[0-9]{1,3})(\.[0-9]{2})?$
	function update() {
      $.getJSON("https://api.coinmarketcap.com/v1/ticker/bitcoin/", 
      function(json){
		 if(json){
		 	$.map(json, function(coin){
				$("#price").text(coin.price_usd);
				$("#change").text(coin.percent_change_24h);
				$("#marketCap").text(coin.market_cap_usd.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
				
				chrome.storage.sync.get(['alertPrice'], function(prices){
					if(coin.price_usd <= prices.alertPrice )
					{
						var notification = {
							type: 'basic',
							iconUrl: 'img/bitcoinIcon48.png',
							title: 'Bitcoin Set Price reached!',
							message: 'The Bigcoin price has reached your set price, Click button below to Buy/Sell your coins!'
						};
						chrome.notifications.create("setBitAlertNotify", notification);
					}
				});
				
				//chrome.storage.sync.set({'coin': coin});
				
				//chrome.storage.sync.get('coin', function(item){
				//	console.log(item.coin.price_usd);
				//});
			});
		 }
    });
  }
	setInterval(update, 10000);
	update();
});