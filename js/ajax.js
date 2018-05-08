//自定义参数；电话号码
var isSubmib = false;
var myUrl = "http://183.240.150.230:3389/userexperience/blacklist";
var a1, c1, d1, f1;
//a1为判断是否黑名单还是普通人，0未否，1为是
//c1用户是否中奖
//d1是否成长值 PK次数
//f1判断中过什么奖品

var lottery_count;

var luckyNum;

var isLastDay = false

var isOver = false

var isLogin = true

//地址栏参数传入页面
function getQueryString(name) { //name为传入参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

var resCode = getQueryString('resCode');
var telephone = getQueryString('telephone');
console.log("resCode的赋值为" + resCode + ",telephone的赋值为" + telephone);


//当页面加载状态改变的时候执行这个方法
document.onreadystatechange = loading;

function loading() {
	$("#loading").show();
	//document.getElementById("loading").style.display="block";
	if (document.readyState == "complete") { //当页面加载状态为完全结束时进入 
		//document.getElementById("loading").style.display="none";
		getData();
	}
}

function openBg() {
	$('.home').show()
	if (resCode == 0) {
		if (telephone == "" || telephone == null) {
			//alert("没电话号码");
			isLogin = false
			$("#loading").hide()
		} else {
			//alert("存在号码");
			var phoneStr = telephone.substr(0, 3) + "****" + telephone.substr(7, 4)
			$('.prize_box>p').eq(1).html(phoneStr)
			isLogin = true
			pdZFB();
		}
	} else {
		//alert("没电话号码");
		$("#loading").hide()
	}
}

//支付宝判断方法
function pdZFB() {
	//console.log(window.navigator.userAgent);
	if (isZFB()) {
		console.log("支付宝");
		isLogin = true
		insert(telephone);
	} else {
		console.log("-----不在支付宝里面-----");
		//不在支付宝上应该打开的链接  正式的话打开下面3个最后面的隐藏

		isLogin = true

		insert(telephone); 
	}

}

function isZFB() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/AlipayClient/i) == 'alipayclient') {
		return true;
	} else {
		return false;
	}
}


//先保存电话号码一个 无论他是否黑名单  
function insert(telephone) {

	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/insert",
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			isSubmib = false;
			//console.log(data);
			console.log('ps:用户号码保存成功');
			query(telephone);
		}
	});
}

//第一步查询是否黑名单,判断是否能参与活动
function query(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/check",
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			isSubmib = false;
			//console.log(data.state);
			if (data.state == true) {
				a1 = 0; //解除黑名单默认为0
				console.log('一,此人为黑名单,a1=' + a1 + '');
				Lucky(telephone);
			} else {
				a1 = 1;
				console.log('一,此人为普通人,a1=' + a1 + '');
				Lucky(telephone);
			}
		}
	});
};


//第二步查询是否中过奖
function Lucky(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/search",
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			isSubmib = false;
			//console.log(data);
			if (data.state == false) {
				c1 = 0;
				f1 = 0
				console.log("二.还没中过奖，奖品名称为c1=" + c1 + ",还没中过奖f1=" + f1);
				getClick(telephone);
			} else {
				isPrize = true
				f1 = data.state;
				c1 = 1;
				console.log("二.提醒已经领取奖品c1=" + c1 + ",已经中过奖f1=" + f1);
				getClick(telephone);
			}
		}
	});
};



//第三步进来查询点击表
function getClick(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/getClick",
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			// console.log(data)
			isSubmib = false;
			//console.log(data);
			if (data.total == null || data.total == 0 || data.msg == "无数据  ") {
				d1 = 0;
				var numList = 3 - d1;
				$('.shengyu_box').html('今天还剩' + numList + '次PK机会')
				console.log('三、点击没有数据或者数据为0,d1=' + d1 + '');
			} else {
				d1 = parseInt(data.total);
				var numList = 3 - d1;

				if (numList == 0) {
					$('.shengyu_box').html('今天的PK次数已用完')
				} else {
					$('.shengyu_box').html('今天还剩' + numList + '次PK机会')
				}
				console.log('三、用户今天有点击过,d1=' + d1 + '');
			}
			getLotteryCount(telephone)
		}
	});
}

function getLotteryCount(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/getraffle",
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: "jsonp",
		success: function(data) {
			isSubmib = false;
			if (data.state == false || data.state <= 0) {
				lottery_count = 0
				$('.lottery_font').html('今天的抽奖次数已用完')
			} else {
				lottery_count = parseInt(data.state)
				$('.lottery_font').html('今天还剩' + parseInt(data.state) + '次抽奖机会')
			}
			playGame()
		}
	})
}

//查询完数据提示窗口
function playGame() {
	console.log('-----------进入游戏准备开始-----------');
	//用户号码
	var bbb = telephone.toString();
	var ccc = bbb.substring(0, 3) + '****' + bbb.substring(7, 11);
	$('.myTel').html(ccc);
	$("#loading").hide();
	if (luckyNum == null) {
		// console.log('中奖值不存在');
	} else {
		//最后要到达的步骤
		//console.log("----------我的中奖数为"+luckyNum);
		// animalIndex = luckyNum;
		// rotateRun();
	}
}

//判断时间
//判断今天的日期
function getData() {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + "/getSysTime",
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			isSubmib = false;
			var nian = data.time.substring(5, 7) + data.time.substring(8, 10); //格式为2017-05-31 23:09:32 展示位2位数 代表时
			var myTimer = data.time.substring(11, 13);
			//console.log('日期为nian='+nian+'');
			var newH1 = parseInt(nian);
			var newTime1 = parseInt(myTimer);
			if (newH1 >= 103 && newH1 < 128) { //测试开放今天
				console.log('~~~~~~~~~~活动正常时间~~~~~~~~~~');
				openBg();
			} else if (newH1 == 128) {
				console.log('~~~~~~~~~~活动最后一天~~~~~~~~~~');
				isLastDay = true
				openBg();
			} else {
                openBg();
				/*console.log('~~~~~~~~~~活动结束~~~~~~~~~~');
				$("#loading").hide();
				$('.shengyu_box').html('今天还剩0次抽奖机会')
				$('.activity_end').show()
				isOver = true*/
			}
		}
	});

}



//用户操作接口
//点击抽奖
function clickData() {
	d1++
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + '/click',
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			//console.log(data);
			isSubmib = false;
			if (data.insert == "点击超过最大值3") {
				$('.shengyu_box').html('今天的PK次数已用完')
			} else {
				var numList = 3 - d1;
				if (numList == 0) {
					$('.shengyu_box').html('今天的PK次数已用完')
				} else {
					$('.shengyu_box').html('今天还剩' + numList + '次PK机会')
				}
			}
		}
	});
}

//增加一次抽奖机会
function addraffle(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
	$.ajax({
		url: myUrl + '/addraffle',
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			//console.log(data);
			isSubmib = false;
			lottery_count++
			$('.lottery_font').html('今天还剩' + lottery_count + '次抽奖机会')
		}
	});
}

//减少一次抽奖机会
function subraffle(telephone) {
	if (isSubmib) {
		return;
	}
	isSubmib = true;
    isSubmib = false;
    lottery_count--
    lottery()
    $('.lottery_font').html('今天还剩' + lottery_count + '次抽奖机会')
	$.ajax({
		url: myUrl + '/subraffle',
		data: {
			'mobile': telephone
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			//console.log(data);
			console.log(data)
			isSubmib = false;
			lottery_count--
			lottery()
			$('.lottery_font').html('今天还剩' + lottery_count + '次抽奖机会')
		}
	});
}


//保存获奖结果
function save(telephone, myPrizeName, myPtype, cb) {
	$.ajax({
		url: myUrl + "/save",
		data: {
			'mobile': telephone,
			'prizeName': myPrizeName,
			'type': myPtype
		},
		type: "get",
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			if (data.save == "保存成功！") {
				//console.log('恭喜你成功保存你的奖品了！');
				isPrize = true
				cb&&cb()
			} else {
				//console.log('抱歉没中奖！');
				var numberarr = [1, 3, 6]
				var i = Math.floor(Math.random() * 3);
				lottery_number = numberarr[i]
				cb&&cb(200,lottery_number)
			}
		}
	});
}

// $(document).on('touchend',function(e){
// 	console.log(a1)
// 	console.log(c1)
// 	console.log(d1)
// 	console.log(f1)
// })