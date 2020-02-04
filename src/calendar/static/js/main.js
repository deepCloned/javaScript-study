'use strict'
let calendar = {
  data: {
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    dayOfWeek: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    chooseedYear: 0,
    chooseedMonth: 0,
    chooseedDate: 0,
    curMonthDays: 0,
    emuraWeek: {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    },
    domYear: document.getElementsByClassName('year')[0],
    domMonth: document.getElementsByClassName('month')[0],
    domDay: document.getElementsByClassName('day')[0],
    domDayOfWeek: document.getElementsByClassName('week-day')[0],
    domTime: document.getElementsByClassName('time')[0],
    selectYear: document.getElementsByClassName('chooseed-year')[0],
    selectMonth: document.getElementsByClassName('chooseed-month')[0],
    weekWrap: document.getElementsByClassName('main-week')[0],
    dayWrap: document.getElementsByClassName('main-day')[0]   
  },
  /**
   * 获取当前时间
   * 返回年月日时分秒 
   */
  getCurDate () {
    let date = new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      week: date.getDay()
    }
  },
  getCurTime () {
    let date = new Date()
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    }
  },
  /**
   * 枚举星期，返回对应中文描述
   * 传入 num，返回星期几 
   */
  translateWeek (num) {
    return this.data.emuraWeek[num]
  },
  /**
   * 格式化时间
   * 传入时分秒，返回时分秒 
   */
  formateTime (h, m, s) {
    let hours = h < 10 ? '0' + h : h
    let minutes = m < 10 ? '0' + m : m
    let seconds = s < 10 ? '0' + s : s
    return `${hours}:${minutes}:${seconds}`
  },
  // 初始化日期，年月日
  initDate () {
    let nowDate = this.getCurDate()
    this.data.year = this.data.chooseedYear = nowDate.year
    this.data.month = this.data.chooseedMonth = nowDate.month + 1
    this.data.day = this.data.chooseedDate = nowDate.day
    this.data.dayOfWeek = nowDate.dayOfWeek
    this.data.week = nowDate.week
  },
  // 初始化时间
  initTime () {
    let nowTime = this.getCurTime()
    this.data.hours = nowTime.hours
    this.data.minutes = nowTime.minutes
    this.data.seconds = nowTime.seconds
  },
  // 渲染标题，显示今日日期
  renderShowDate () {
    this.data.domYear.innerHTML = this.data.year
    this.data.domMonth.innerHTML = this.data.month
    this.data.domDay.innerHTML = this.data.day
    let weekDay = this.translateWeek(this.data.week)
    document.getElementsByClassName('week-day')[0].innerText = weekDay
  },
  // 渲染实时时间
  renderShowTime () {
    let { hours, minutes, seconds } = this.data
    this.data.domTime.innerHTML = this.formateTime(hours, minutes, seconds)
  },
  // 渲染日期显示表头
  renderWeeks () {
    const self = this
    let week = this.data.emuraWeek
    Object.keys(week).forEach((ele) => {
      self.addContent(self.data.weekWrap, 'span', week[ele])
    })
  },
  renderSelectDate () {
    /* 渲染选择框 */
    this.data.selectYear.innerHTML = this.data.chooseedYear
    this.data.selectMonth.innerHTML = this.data.chooseedMonth
  },
  // 渲染日期天数显示
  renderDateOfMonth () {
    // 初始化，清空
    this.data.dayWrap.innerText = ''
    this.getDaysOfMonth()
    this.getDayOfMonth()
    let startDay = this.data.dayOfWeek
    // startDay = startDay === 0 ? 7 : startDay
    const self = this
    /**
     * 首先看本月一号是星期几
     */
    if (startDay !== 0) {
      for (let i = 0; i < startDay; i ++) {
        self.addContent(this.data.dayWrap, 'li', '')
      }
    }
    for (let i = 0; i < this.data.curMonthDays; i ++) {
      let { year, month, day, chooseedYear, chooseedMonth } = this.data
      let dayLi = document.createElement('li')
      dayLi.innerText = i + 1
      // 是否是今天，如果是今天，加上特定样式
      if (year === chooseedYear && month === chooseedMonth && (i + 1) === day) {
        dayLi.classList.add('active-curday')
      }
      if ((i + 1) === day) {
        dayLi.classList.add('active')
      }
      this.data.dayWrap.appendChild(dayLi)
    }
  },
  // 实时更新时间
  setCurTime () {
    setInterval(() => {
      this.initTime()
      this.renderShowTime()
    }, 1000)
  },
  /**
   * 绑定事件 
   */
  bindEvent () {
    // 点击上一年
    let lastYear = document.getElementsByClassName('last-year')[0]
    lastYear.addEventListener('click', () => {
      this.changeSelectYear(-1)
      this.renderDateOfMonth()
      console.log(this.data)
    })

    // 点击下一年
    let nextYear = document.getElementsByClassName('next-year')[0]
    nextYear.addEventListener('click', () => {
      this.changeSelectYear(1)
      this.renderDateOfMonth()
    })

    // 点击上月
    let lastMonth = document.getElementsByClassName('last-month')[0]
    lastMonth.addEventListener('click', () => {
      let curMonth = parseInt(this.data.selectMonth.innerText)
      let nextValue
      if (curMonth === 1) {
        nextValue = 12
        this.changeSelectYear(-1)
      } else {
        nextValue = curMonth - 1
      }
      this.data.chooseedMonth = nextValue
      this.data.selectMonth.innerText = nextValue
      this.renderDateOfMonth()
    })

    // 点击下月
    let nextMonth = document.getElementsByClassName('next-month')[0]
    nextMonth.addEventListener('click', () => {
      let curMonth = parseInt(this.data.selectMonth.innerText)
      let nextValue
      if (curMonth === 12) {
        nextValue = 1
        this.changeSelectYear(1)
      } else {
        nextValue = curMonth + 1
      }
      this.data.chooseedMonth = nextValue
      this.data.selectMonth.innerText = nextValue
      this.renderDateOfMonth()
    })

    // 点击返回今天
    let backToday = document.getElementsByClassName('back-today')[0]
    backToday.addEventListener('click', () => {
      this.initDate()
      this.initTime()
      this.renderShowDate()
      this.renderShowTime()
      this.renderSelectDate()
      this.renderDateOfMonth()
    })

    // 点击具体日期
    this.data.dayWrap.addEventListener('click', (e) => {
      let target = e.target
      if (target.nodeName === 'LI') {
        if (target.innerText) {
          let activeDate = document.getElementsByClassName('active')[0]
          if (activeDate) {
            activeDate.classList.remove('active')
          }
          target.classList.add('active')
        }
      } else {
        console.log('ul')
      }
    }, false)

    // 滑动事件
    let calendarContent = document.getElementsByClassName('content-header')[0]
    document.addEventListener('DOMMouseScroll', (e) => {
      console.log(e)
    }, false)
  },
  /**
   * 加减年份函数
   * 传入dom节点和增加的年数 
   */
  changeSelectYear (num) {
    let curYear = parseInt(this.data.selectYear.innerText)
    let nextValue = curYear + num
    this.data.chooseedYear = nextValue
    this.data.selectYear.innerText = nextValue
  },
  /**
   * 获取所选月份的天数
   * 传入年、月，返回天数
   * 通过获取上月最后一天的date得到天数
   */
  getDaysOfMonth () {
    let { chooseedYear, chooseedMonth } = this.data
    this.data.curMonthDays = new Date(chooseedYear, chooseedMonth, 0).getDate()
  },
  /**
   * 获取本月一号是星期几 
   */
  getDayOfMonth () {
    let { chooseedYear, chooseedMonth } = this.data
    this.data.dayOfWeek = new Date(chooseedYear, chooseedMonth - 1, 1).getDay()
  },
  /**
   * 给特定 DOM 节点增加元素
   * 传入父级dom 创建的dom节点 内容
   */
  addContent (parent, ele, content) {
    let element = document.createElement(ele)
    element.textContent = content
    parent.appendChild(element)
  },
  init () {
    this.initDate()
    this.initTime()
    this.renderShowDate()
    this.renderShowTime()
    this.renderSelectDate()
    this.renderWeeks()
    this.renderDateOfMonth()
    this.bindEvent()
  }
}

calendar.init()
calendar.setCurTime()
