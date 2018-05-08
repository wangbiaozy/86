//解决页面适配，使用rem为单位编辑css样式
function adapt(designWidth, rem2px) {
  var d = window.document.createElement('div');
  d.style.width = '1rem';
  d.style.display = "none";
  var head = window.document.getElementsByTagName('head')[0];
  head.appendChild(d);
  var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
  d.remove();
  // document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
  var st = document.createElement('style');
  var portrait = "@media screen and (min-width: " + window.innerWidth + "px) {html{font-size:" + ((window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}";
  var landscape = "@media screen and (min-width: " + window.innerHeight + "px) {html{font-size:" + ((window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}"
  st.innerHTML = portrait + landscape
  head.appendChild(st);
  return defaultFontSize
};

//单位转换，7.5rem为屏幕总宽度
var defaultFontSize = adapt(750, 100);

var imgs = ['./img/rule.png','./img/choujiang_bg.png','./img/home_bg.png','./img/load.png',
'./img/page_bg.png','./img/choujiang_box.png']

function PreLoad(imgs, opts) {
  this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
  this.opts = $.extend({}, PreLoad.DEFAULTS, opts);
  if (this.opts.order === 'ordered') {
    this._ordered(); // 有序加载
  } else {
    this._unordered(); // 无序加载
  }
}
PreLoad.DEFAULTS = {
  order: 'unordered', //默认进行无序预加载
  each: null, // 单个图片加载完成后执行的方法
  all: null // 所有图片加载完成后执行的方法
};

PreLoad.prototype._ordered = function() { // 有序加载
  var imgs = this.imgs,
    len = imgs.length,
    count = 0,
    opts = this.opts;
  load();

  function load() {
    var img = new Image();
    $(img).on('load error', function() {
      opts.each && opts.each(count);
      if (count >= len) {
        // 所有图片加载完毕
        opts.all && opts.all();
      } else {
        load();
      }
      count++;
    });
    img.src = imgs[count];
  }
};

PreLoad.prototype._unordered = function() { // 无序加载
  var imgs = this.imgs,
    len = imgs.length,
    count = 0,
    opts = this.opts;
  imgs.forEach(function(elem) {
    var img = new Image();
    $(img).on('load error', function() {
      opts.each && opts.each(count);
      if (count >= len - 1) {
        opts.all && opts.all();
      }
      count++;
    });
    img.src = elem;
  });
};

$.extend({
  preload: function(imgs, opts) {
    new PreLoad(imgs, opts);
  }
});


var xian_left = document.getElementById('xian_left')
var robot = document.getElementById('robot')
var xian_right = document.getElementById('xian_right')
var man = document.getElementById('man')

//程序主线程
$(document).ready(function() {

  $.preload(imgs, { // imgs: 图片数组或字符串 ['1.jgp', '2.jpg'] 或者 '1.jpg'
    order: 'ordered', // 默认无序加载
    each: function(count) {
      // 单个图片加载完成
    },
    all: function() {
      // 所有图片加载完成
      //执行代码
      console.log('完成图片预加载')
    }
  });

  bindEvent()

  //事件绑定
  function bindEvent() {

    //秘籍按钮
    $('.miji_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.cover1').show()
      $('.miji').show()
    })

    //秘籍遮罩层，第一层点击事件
    $('.cover1').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.cover1').hide()
      $('.cover2').show()
    })

    //秘籍遮罩层，第二层点击事件
    $('.cover2').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.cover2').hide()
      $('.miji').hide()
    })

    //规则按钮
    $('.rule_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.rule').show()
    })

    //分享按钮
    $('.share_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.share').show()
    })

    //分享遮罩层点击事件
    $('.share').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $(this).hide()
    })

    //关闭按钮事件
    $('.close_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $(this).parent().parent().hide()
    })

    //活动结束弹窗，点击获得更多福利
    $('.activity_end .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = "https://qr.alipay.com/ppx00000euor267oqmtyoa2";
    })

    $('.login .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = "https://qr.alipay.com/ppx00000euor267oqmtyoa2";
    })

    //今天PK次数用完分享按钮
    $('.out .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.game').hide()
      $('.lottery').hide()
      $('.home').show()
      $('.out').hide()
      $('.share').show()
    })

    //今天PK次数用完分享按钮
    $('.lastday_out .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.game').hide()
      $('.lottery').hide()
      $('.home').show()
      $('.lastday_out').hide()
      $('.share').show()
    })

    //游戏页回到首页按钮
    $('.back_to_home_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();

      $('.lottery').hide()
      $('.home').show()
    })

    //准备好了按钮
    $('.ready .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.ready').hide()
      game()
    })

    //首页去PK按钮
    $('.home_pk_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      if (isOver) {
        $('.activity_end').show()
      } else {
        if (!isLogin) {
          $('.login').show()
        } else {
          if (d1 >= 3) {
            if (isLastDay) {
              $('.lastday_out').show()
            } else {
              $('.out').show()
            }
          } else {
            $('.home').hide()
            initMan()
            $('.ready').show()
            $('.game').show()
          }
        }
      }
    })

    //获得一次抽奖机会后再PK按钮
    $('.get_lottery_pk_again').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();

      if (d1 >= 3) {
        if (isLastDay) {
          $('.get_lottery').hide()
          $('.lastday_out').show()
        } else {
          $('.get_lottery').hide()
          $('.out').show()
        }
      } else {
        $('.get_lottery').hide()
        initMan()
        $('.ready').show()
      }
    })

    //游戏失败后，再pk一次按钮
    $('.pk_failure .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      if (d1 >= 3) {
        if (isLastDay) {
          $('.pk_failure').hide()
          $('.lastday_out').show()
        } else {
          $('.pk_failure').hide()
          $('.out').show()
        }
      } else {
        initMan()
        $('.ready').show()
        $('.pk_failure').hide()
      }

    })

    //抽奖次数用完去PK
    $('.lottery_out .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      if (d1 >= 3) {
        if (isLastDay) {
          $('.lottery_out').hide()
          $('.lastday_out').show()
        } else {
          $('.lottery_out').hide()
          $('.out').show()
        }
      } else {
        $('.lottery_out').hide()
        $('.home').hide()
        $('.lottery').hide()
        initMan()
        $('.ready').show()
        $('.game').show()
      }
    })

    //没有获得奖品弹窗去PK
    $('.kongkong .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      if (d1 >= 3) {
        if (isLastDay) {
          $('.kongkong').hide()
          $('.lastday_out').show()
        } else {
          $('.kongkong').hide()
          $('.out').show()
        }
      } else {
        $('.kongkong').hide()
        $('.home').hide()
        initMan()
        $('.ready').show()
        $('.game').show()
      }
    })

    //明天再来关闭按钮
    $('.out_close').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.out').hide()
      $('.game').hide()
      $('.lottery').hide()
      $('.home').show()
    })

    //最后一天明天再来关闭按钮
    $('.lastday_out_close').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.lastday_out').hide()
      $('.game').hide()
      $('.lottery').hide()
      $('.home').show()
    })

    //首页去抽奖按钮
    $('.toGetAward_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();

      if (isOver) {
        $('.activity_end').show()
      } else {
        if (!isLogin) {
          $('.login').show()
        } else {
          if (lottery_count <= 0) {
            $('.lottery_out').show()
          } else {
            $('.home').hide()
            $('.lottery').show()
          }
        }
      }
    })

    //获得抽奖机会弹窗，去抽奖按钮
    $('.get_lottery_to_lottery').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();

      $('.get_lottery').hide()
      $('.game').hide()
      $('.lottery').show()
    })

    //我的礼物按钮
    $('.myPrize_btn').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      if (isOver) {
        $('.activity_end').show()
      } else {
        if (!isLogin) {
          $('.login').show()
        } else {
          if (f1 == 0) {
            $('.kongkong').show()
          } else if (f1 == '30M') {
            dealPrize(4)
          } else if (f1 == '50M') {
            dealPrize(5)
          } else if (f1 == '150M') {
            dealPrize(7)
          } else if (f1 == '1G') {
            dealPrize(2)
          } else if (f1 == '2G') {
            dealPrize(0)
          }
        }
      }
    })

    $('.lottery_again .alert_box').on('touchend', function(e) {
      event.preventDefault();
      event.stopPropagation();
      $('.lottery_again').hide()
    })

  }

  //游戏函数
  function game() {

    clickData()

    var gameover;
    var isWin;
    var man_during;

    var changeY = getMoveY()

    function getMoveY() {
      var shengliBox = document.getElementById('game_title')
      var robot = document.getElementById('robot')
      var man = document.getElementById('man')

      var y = robot.offsetTop - (shengliBox.offsetTop + shengliBox.getBoundingClientRect().height)

      var width = window.screen.width;

      y = (y * (750 / width) / 100).toFixed(2)

      return y

    }

    gameInit()

    //匀速运动方法
    function Linear(t, b, c, d) {
      return c * t / d + b;
    }

    function gameInit() {
      gameover = false
      isWin = false
      man_during = 1000

      $('.hand').show()
      xian_left.style.WebkitTransition = xian_left.style.transform = 'translateY(' + 0 + 'rem)'
      xian_right.style.WebkitTransition = xian_right.style.transform = 'translateY(' + 0 + 'rem)'
      robot.style.WebkitTransition = robot.style.transform = 'translateY(' + 0 + 'rem)'
      man.style.WebkitTransition = man.style.transform = 'translateY(' + 0 + 'rem)'

      gameStart()
    }


    function gameStart() {

      $('.run_btn').one('touchend', function(e) {
        event.preventDefault();
        event.stopPropagation();
        $('.hand').hide()
        load_left_move()
        load_right_move()
      })

      //点击移动按钮加快移动速度
      $('.run_btn').on('touchend', function(e) {
        event.preventDefault();
        event.stopPropagation();
        man_during = man_during - 30
      })

    }

    //左边路移动
    function load_left_move() {

      var start = 0
      var beginning = 0
      var change = 50
      var during = 500

      var robot_change = changeY

      //运动函数
      var run = function() {

        start++;
        //获取运动增量
        var variety = Linear(start, beginning, change, during);
        var robot_variety = Linear(start, beginning, robot_change, during);

        //增加黄线图片dom
        if (parseInt(variety % 5) == 0 && parseInt(variety) % 2 == 0) {
          $('#xian_left').prepend('<img src="./img/xian.png">')
        }
        //减少黄线图片dom，避免插入过多的dom节点
        if (parseInt(variety % 5) == 0 && parseInt(variety) % 4 == 0) {
          $('#xian_left').children("img:last-child").remove();
        }

        //改变tansform生成动画效果
        xian_left.style.WebkitTransition = xian_left.style.transform = 'translateY(' + variety + 'rem)'
        robot.style.WebkitTransition = robot.style.transform = 'translateY(' + (-robot_variety) + 'rem)'


        if (start < during && !gameover) {
          requestAnimationFrame(run)
        } else {
          //清除多余的黄线图片dom
          var n_left = $('#xian_left img').length
          for (var i = 0; i < n_left - 3; i++) {
            $('#xian_left img').eq(i).remove()
          }
          //游戏结束判定
          if (gameover == false) {
            gameover = true
            isWin = false
            $('.run_btn').unbind()
            $('.pk_failure').show()
          }
        }
      }
      run()
    }

    //右边路移动
    function load_right_move() {

      var right_start = 0
      var right_beginning = 0
      var xian_right_change = 50

      var man_change = changeY

      //运动函数
      var run = function() {
        right_start++;
        //获取运动增量
        var xian_right_variety = Linear(right_start, right_beginning, xian_right_change, man_during);
        var man_variety = Linear(right_start, right_beginning, man_change, man_during);

        //增加黄线图片dom
        if (parseInt(xian_right_variety % 5) == 0 && parseInt(xian_right_variety) % 2 == 0) {
          $('#xian_right').prepend('<img src="./img/xian.png">')
        }
        //减少黄线图片dom，避免插入过多的dom节点
        if (parseInt(xian_right_variety % 5) == 0 && parseInt(xian_right_variety) % 4 == 0) {
          $('#xian_right').children("img:last-child").remove();
        }
        //改变tansform生成动画效果
        xian_right.style.WebkitTransition = xian_right.style.transform = 'translateY(' + xian_right_variety + 'rem)'
        man.style.WebkitTransition = man.style.transform = 'translateY(' + (-man_variety) + 'rem)'

        if (right_start < man_during && !gameover) {
          requestAnimationFrame(run)
        } else {
          xian_right.style.WebkitTransition = xian_right.style.transform = 'translateY(' + 3 + 'rem)'
          //清除多余的黄线图片dom
          var n_right = $('#xian_right img').length
          for (var j = 0; j < n_right - 3; j++) {
            $('#xian_right img').eq(j).remove()
          }
          //游戏结束判定
          if (gameover == false) {
            gameover = true
            isWin = true
            addraffle(telephone)
            $('.run_btn').unbind()
            $('.get_lottery').show()
          }
        }
      }
      run()
    }
  } //game end

  bindLotteryBtn()

})


function bindLotteryBtn() {
  $('.start_lottery').one('touchend', function(e) {
    $('.start_lottery').unbind()
    if (lottery_count <= 0) {
      $('.lottery_out').show()
      bindLotteryBtn()
    } else {
      subraffle(telephone)
    }
  })
}



//抽奖函数
function lottery() {
  //下标数组
  var indexArr = [0, 1, 2, 5, 8, 7, 6, 3]

  var i

  var lottery_number;
  var jian;
  var jia;
  var keep;
  var number;
  var isGetLottery;
  var second;

  intLottery()

  function intLottery() {


    $('.box .cover').hide()

    i = 0
    jian = true
    jia = false
    keep = false
    number = 0
    isGetLottery = false
    second = false

    createPrzie(runlottery)

  }


  function runlottery(time, lottery_number) {
    var count = 0
    var time1 = setInterval(function(e) {
      if (i == 8) {
        i = 0
      }
      $('.box .cover').eq(indexArr[i]).show()
      if (i != 0) {
        $('.box .cover').eq(indexArr[i - 1]).hide()
      } else {
        $('.box .cover').eq(indexArr[7]).hide()
      }

      if (count == 1 && jian) {
        if (!keep) {
          time = time - 50
        }
        if (time <= 80) {
          jian = false
          keep = true
        } else {
          clearInterval(time1)
          runlottery(time, lottery_number)
        }
      }

      if (count == 1 && keep) {
        clearInterval(time1)
        runlottery(time, lottery_number)
        if (number > 30) {
          keep = false
          jia = true
        }
      }

      if (count == 1 && jia) {
        time = time + 50
        if (time > 210) {
          jia = false
          isGetLottery = true
        } else {
          clearInterval(time1)
          runlottery(time, lottery_number)
        }
      }


      if (i == lottery_number && isGetLottery) {

        clearInterval(time1)

        if (second) {
          setTimeout(function(e) {

            dealPrize(lottery_number)

            $('.box .cover').hide()
            bindLotteryBtn()

          }, 1000)
        }
        second = true
      }

      i++
      count++
      number++

    }, time)
  }
}


function createPrzie(cb) {
  var lottery_number = 1
  if (a1 == 0) {
    var numberarr = [1, 3, 6]
    var i = Math.floor(Math.random() * 3);
    lottery_number = numberarr[i]
    cb && cb(200, lottery_number)
  } else {
    if (f1 != 0) {
      var numberarr = [1, 3, 6]
      var i = Math.floor(Math.random() * 3);
      lottery_number = numberarr[i]
      cb && cb(200, lottery_number)
    } else {
      //成立一个随机函数 判断概率
      var ntt = Math.floor(Math.random() * 10000 + 1);
      if (ntt > 0 && ntt <= 5) {
        lottery_number = 0
        save(telephone, "2G", 1, cb(200, lottery_number));
      } else if (ntt > 5 && ntt <= 23) {
        lottery_number = 2
        save(telephone, "1G", 2, cb(200, lottery_number));
      } else if (ntt > 23 && ntt <= 53) {
        lottery_number = 7
        save(telephone, "500M", 3, cb(200, lottery_number));
      } else if (ntt > 53 && ntt <= 125) {
        lottery_number = 5
        save(telephone, "150M", 4, cb(200, lottery_number));
      } else if (ntt > 125 && ntt <= 275) { //255
        lottery_number = 4
        save(telephone, "30M", 5, cb(200, lottery_number));
      } else { //不中  
        var numberarr = [1, 3, 6]
        var i = Math.floor(Math.random() * 3);
        lottery_number = numberarr[i]
        cb && cb(200, lottery_number)
      }
    }
  }
  return lottery_number
}

function initMan() {
  robot.style.WebkitTransition = robot.style.transform = 'translateY(' + 0 + 'rem)'
  man.style.WebkitTransition = man.style.transform = 'translateY(' + 0 + 'rem)'
}

function dealPrize(lottery_number) {
  if (lottery_number == 1 || lottery_number == 3 || lottery_number == 6) {
    $('.lottery_again').show()
  } else if (lottery_number == 0) {
    $('.prize_box p').eq(0).html('真让人羡慕！恭喜')
    $('.liuliang_font').html('2G')
    $('.prize').show()
  } else if (lottery_number == 2) {
    $('.prize_box p').eq(0).html('人品大爆发！恭喜')
    $('.liuliang_font').html('1G')
    $('.prize').show()
  } else if (lottery_number == 4) {
    $('.liuliang_font').html('30M')
    $('.prize').show()
  } else if (lottery_number == 5) {
    $('.liuliang_font').html('150M')
    $('.prize').show()
  } else if (lottery_number == 7) {
    $('.liuliang_font').html('500M')
    $('.prize').show()
  }
}