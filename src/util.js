/* 时间戳转换 */
export const formateTime = dataTime => {
    if (!dataTime){
        dataTime = new Date().getTime();
    }
    let date = new Date(dataTime)
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m
  }