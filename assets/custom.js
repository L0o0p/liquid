class ImageList extends HTMLElement {
  constructor() {
    super();
    this.bindEvents();
  }

  bindEvents() {
    const sliderContainer = this.querySelector(".index_listImage_box");
    const slider = this.querySelector(".index_listImage_rightBox");
    var that = this;
    $(window).on("load", function() {

      // 等待页面加载完成后执行代码

      // 获取初始滚动位置并处理滚动事件
      handleScroll();
      window.addEventListener("scroll", handleScroll);

      // 监听窗口大小变化事件，更新总高度
      $(window).resize(function() {
        calculateTotalHeight();
      });

      // 计算总高度
      calculateTotalHeight();

      var swiper = new Swiper('.index_listImage_swiper', {
        slidesPerView: 1.4,
        centeredSlides: true,
        loop: true
      });
    });
    let totalHeight = 0; // 初始的总高度
    let totalHeightTop = 0; // 根据元素数量计算的X轴偏移量上限
    let translateX = 0; // 初始的X轴偏移量
    function calculateTotalHeight() {

      // 获取所有元素
      const elements = $(that).find(".index_listImage_rightBox_bx");

      // 获取元素数量
      const totalLength = elements.length;

      // 计算总高度
      totalHeight = elements.first().width() * totalLength + 35 * (totalLength - 1);

      // 更新滑动容器的高度
      sliderContainer.style.height = totalHeight + "px";
    }
    function handleScroll() {

      // 获取滚动的垂直位置
      const scrollY = window.scrollY || window.pageYOffset;
      var mtTop = $(that).offset().top;

      // 检查是否滚动到指定位置
      if (scrollY >= mtTop) {
        
        $('.index_listImageBox').css('position', 'fixed');

        totalHeightTop = - totalHeight + 3 * ($(".index_listImage_rightBox_bx").width() + 35);

        if (scrollY - mtTop >= totalHeight - $('.index_listImageBox').height()) {
          $('.index_listImageBox').css('position', 'absolute');
        }

        // 根据滚动方向调整X轴偏移量
        translateX = (scrollY - mtTop) * -1;

        // 限制X轴偏移量不能超过上限
        translateX = Math.max(Math.min(translateX, 0), totalHeightTop);

        // 设置transform属性
        slider.style.transform = `translate3d(${translateX}px, 0, 0)`;

        var currentDivIndex = Math.ceil(- translateX / totalHeight * 10); // 计算当前滚动到了第几个div
          if (currentDivIndex == 1) {
            $(that).find('.index_listImage-leftBox').show()
            $(that).find('.listImage_button').show()
            $(that).find('.index_listImage-leftBox1').hide()
            $(that).find('.listImage_button1').hide()
            $(that).find('.index_listImage-leftBox2').hide()
            $(that).find('.listImage_button2').hide()
          } else if (currentDivIndex == 4) {
            $(that).find('.index_listImage-leftBox').hide()
            $(that).find('.listImage_button').hide()
            $(that).find('.index_listImage-leftBox1').show()
            $(that).find('.listImage_button1').show()
            $(that).find('.index_listImage-leftBox2').hide()
            $(that).find('.listImage_button2').hide()
          } else if (currentDivIndex == 7) {
            $(that).find('.index_listImage-leftBox').hide()
            $(that).find('.listImage_button').hide()
            $(that).find('.index_listImage-leftBox1').hide()
            $(that).find('.listImage_button1').hide()
            $(that).find('.index_listImage-leftBox2').show()
            $(that).find('.listImage_button2').show()
          }
      } else {
        $('.index_listImageBox').css('position', 'sticky');
      }
    }
  }
}

if (!window.customElements.get('image-list')) {
  window.customElements.define('image-list', ImageList);
}


class MarketValue extends HTMLElement {
  constructor() {
    super()
    this.bindEvents()
  }

  get numValue() {
    return this.getAttribute('dealerValue')
  }

  get numValue1() {
    return this.getAttribute('dealerValue1')
  }

  bindEvents() {
    var that = this;
    const numValue = this.numValue;
    const numValue1 = this.numValue1;
    $(document).ready(function(){
      // 创建 Intersection Observer 实例
      var isIntersecting = false;
      var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
              // 如果元素进入视窗且开关为关闭状态
              if (entry.isIntersecting && !isIntersecting) {
                  isIntersecting = true; // 打开开关
                  $(that).find('.numericColumn_value').animate({height: `${numValue}%`}, 1000);
                  $(that).find('.numericColumn_valueText').animate({opacity: 1}, 1000);
                  $(that).find('.numericColumn_value1').animate({height: `${numValue1}%`}, 500);
              }
          });
      },{
        threshold: 1.0, 
        rootMargin: '30px' 
      });
      // 监听目标元素
      observer.observe(that);
    });
  }
}

if (!window.customElements.get('market-value')) {
  window.customElements.define('market-value', MarketValue);
}

class DownloadList extends HTMLElement {
  constructor() {
    super()
    this.bindEvents()
  }

  bindEvents() {
    $(document).ready(function(){
        $('.tab-content').addClass('tab-content1');
        $('.downloadTab_list .tab-button:first-child').addClass('tabActive');
    });
    $(this).delegate( '.tab-button','click', function() {
      var tab = $(this).data('tab')
      changeTab(tab)
    })
    $(this).delegate('.palyIcon','click',  function() {
      palyIcon(this)
    })
    $(this).delegate('.downloadVideo_button', 'click', function() {
      downloadVideo(this)
    })

    function changeTab(tabIndex) {
      
        // 显示或隐藏所有tab内容
        var tabContents = Array.from($('.tab-content'));
        if (tabIndex === 'all') {
          $('.downloadTab_list .tab-button:first-child').addClass('tabActive').siblings().removeClass('tabActive');
            tabContents.forEach(function(tabContent){
                $(tabContent).addClass('tab-content1');
            });
        } else {
            $('.tab-button').eq(tabIndex).addClass('tabActive').siblings().removeClass('tabActive');
            tabContents.forEach(function(tabContent){
                $(tabContent).removeClass('tab-content1');
            });
            // 显示选中的tab内容
            $('.downloadContainer_list #tab' + parseInt(tabIndex)).addClass('tab-content1').prependTo('.downloadContainer_list');
        }
    }
    function palyIcon(i){
      let videoUrl = $(i).parent('.downloadList_rightImg').attr('data-url');
      let iframeId = $(i).parent('.downloadList_rightImg').attr('data-id');
      let iframeUrl = `https://www.youtube.com/embed/${ iframeId }?controls=1&mute=1&autoplay=1`
      $('.videoShadow').show();
      $('.videoBox').css('display','flex');
      $('#shopify-section-announcement-bar').css('z-index','1');
      $('#shopify-section-header').css('z-index','1')
      $('#shopify-section-footer').css('position','initial')
      $('.max-w-full').css("overflow", "hidden")
      if(videoUrl != '' && iframeId == ''){
        $('#activity_allVideo').attr('src',videoUrl)
        $('#activity_allVideo').show();
        $('#activity_allIframe').hide();
      }else if( videoUrl == '' &&  iframeId != ''){
        $('#activity_allIframe').attr('src',iframeUrl)
        $('#activity_allVideo').hide();
        $('#activity_allIframe').show();
      }
    }
    function downloadVideo(i){
        let videoUrl = $(i).parent('.downloadList_right').attr('data-url');
      let iframeId = $(i).parent('.downloadList_right').attr('data-id');
      let iframeUrl = `https://www.youtube.com/embed/${ iframeId }?controls=1&mute=1&autoplay=1`
      $('.videoShadow').show();
      $('.videoBox').css('display','flex');
      $('#shopify-section-announcement-bar').css('z-index','1');
      $('#shopify-section-header').css('z-index','1')
      $('#shopify-section-footer').css('position','initial')
      $('.max-w-full').css("overflow", "hidden")
      if(videoUrl != '' && iframeId == ''){
        $('#activity_allVideo').attr('src',videoUrl)
        $('#activity_allVideo').show();
        $('#activity_allIframe').hide();
      }else if( videoUrl == '' &&  iframeId != ''){
        $('#activity_allIframe').attr('src',iframeUrl)
        $('#activity_allVideo').hide();
        $('#activity_allIframe').show();
      }
    }
    
    $('.videoShadow').click(function(){
        $('.videoShadow').hide();
        $('.videoBox').hide();
        $('#activity_allVideo').attr('src','');
        $('#activity_allIframe').attr('src','');
        $('#shopify-section-announcement-bar').css('z-index','5');
      $('#shopify-section-header').css('z-index','4')
          $('#shopify-section-footer').css('position','relative')
      $('.max-w-full').css("overflow", "auto")
    })
    $('.closureIcon').click(function(){
        $('.videoShadow').hide();
        $('.videoBox').hide();
        $('#activity_allVideo').attr('src','');
        $('#activity_allIframe').attr('src','');
        $('#shopify-section-announcement-bar').css('z-index','5');
      $('#shopify-section-header').css('z-index','4')
        $('#shopify-section-footer').css('position','relative')
        $('.max-w-full').css("overflow", "auto")
    })
  
  }
}
if (!window.customElements.get('download-list')) {
  window.customElements.define('download-list', DownloadList);
}