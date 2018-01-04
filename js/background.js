$(function(){
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
								iconUrl: 'img/bitcoin_Icon48.png',
								title: 'Bitcoin Set Price reached!',
								message: 'The Bigcoin price has reached your set price, Click button below to Buy/Sell your coins!'
							};
							chrome.notifications.create("setBitAlertNotify", notification);
						}
					});
				});
			 }
			 
		});
	}
	setInterval(update, 30000);
	update();
});
