
//表单验证
class Validate{
    constructor(){

    }
    //只能输入下划线和字母，数字
    inputNameCode(e){
        let value = e.target.value;
        let returnArray = [];
        let valueArray = value.split('');
        //var usern = /^[a-zA-Z0-9_]{1,}$/;
        let firstChart = /^[a-zA-Z_]$/;
        let codePattern = /^[a-zA-Z0-9_]{1,}$/;
        //首字母只能输入下划线 和字母
        if(firstChart.test(valueArray[0])){
            for(let i = 0; i < valueArray.length; i++){
                if(codePattern.test(valueArray[i])){
                    returnArray.push(valueArray[i]);
                }
            }
            return returnArray.join('');
        }else {
            return '';
        }
    }
    //只能输入数字
    inputNumber(e){
        let value = e.target.value;
        let returnArray = [];
        let valueArray = value.split('');
        let codePattern = /^[0-9]{1,}$/;
        if(!!value){
            for(let i = 0; i < valueArray.length; i++){
                if(codePattern.test(valueArray[i])){
                    returnArray.push(valueArray[i]);
                }
            }

            return returnArray.join('');
        }else {
            return '';
        }
    }
    add0(m){return m<10?'0'+m:m }
    //时间戳转化成时间格式
    timeFormat(timestamp){
        //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = time.getMonth()+1;
        let date = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' +
            this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
    }
    transformOutputType(id){
        if(id == 1){
            return '数字';
        }else if(id == 2){
            return '字符串';
        }else if(id == 3){
            return '布尔值';
        }else if(id == 4){
            return '对象';
        }else{
            return '';
        }
    }

}

export const validate = new Validate();