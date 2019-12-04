'use strict';

angular.module('app')
    .filter('search',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.BridgeNum.match(str) && item.BridgeName.match(str1)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('passage',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.PassagewayName.match(str) && item.PassagewayNum.match(str1)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('BriHis',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            console.log(str);
            console.log(str1);
            for(let item of oldValue){
                console.log(oldValue);
                if (item.BuildType.match(str) && item.BuildDate.match(str1) ){
                    newData.push(item)
                }
            }

            return newData;
        }
    })

    .filter('document',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                console.log(oldValue);
                if (item.DocumentName.match(str) && item.DocumentType.match(str1) ){
                    newData.push(item)
                    console.log(newData)
                }
            }
            return newData;
        }
    })

    .filter('curingstatis',function () {
        
        return function (oldValue,str,str1) {
            console.log(oldValue)
            let newData = [];
            for(let item of oldValue){
                if (item.Odd_Numbers === str || item.facilitiesname === str1){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('task',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.facilitype.match(str) && item.facilitiesnum.match(str1)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('patrol',function () {
        return function (oldValue,str,str1,str2,str3) {
            let newData = [];
            for(let item of oldValue){
                if (item.facilitiesnum.match(str) && item.A_Signin_date.match(str1) && item.B_Signin_date.match(str2) && item.branch.match(str3)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })
  .filter('patrolAssess',function () {
    return function (oldValue,str,str1,str2,str3) {
      let newData = [];
      for(let item of oldValue){
        if (item.facilitiesname.match(str) && item.A_Signin_date.match(str1) && item.B_Signin_date.match(str2) && item.branch.match(str3)){
          newData.push(item)
        }
      }
      console.log(newData)
      return newData;
    }
  })

    .filter('order',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.Odd_Numbers === str ||  item.facilitiesnum === str1){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('planParent',function () {
        return function (oldValue,str) {
            let newData = [];
            for(let item of oldValue){
                if (item.plan_name.match(str)){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })


    .filter('regular',function () {
        return function (oldValue,str,str1,str2) {
            let newData = [];
            for(let item of oldValue){
                console.log(oldValue)
                if (item.Facility_type === str || item.facilityName ===str1 || item.Patrol_unit === str2){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('regularCheck',function () {
        return function (oldValue,str,str1,str2,str3) {
            let newData = [];
            for(let item of oldValue){
                console.log(oldValue)
                if (item.plan_name === str || item.Facility_type ===str1 || item.facilityName === str2 || item.Patrol_unit === str3){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('loadtest',function () {
        return function (oldValue,str,str1,str2) {
            let newData = [];
            for(let item of oldValue){
                if (item.bridgename.match(str) && item.Filling_person.match(str1) && item.Inspection_date.match(str2)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('notice',function () {
        return function (oldValue,str) {
            let newData = [];
            for(let item of oldValue){
                if (item.content.match(str)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('component',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.ComponentTypeName.match(str) && item.ComponentType.match(str1)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('memo',function () {
        return function (oldValue,str,str1) {
            console.log(oldValue)
            let newData = [];
            for(let item of oldValue){
                if (item.theme.match(str) && item.creat_time.match(str1)){
                    newData.push(item)
                }
            }
            return newData;
        }
    })

    .filter('taskCheck',function () {
        return function (oldValue,str) {
            let newData = [];
            for(let item of oldValue){
                if (item.facilities_type === str){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })

    .filter('plan',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.facilities_type === str || item.plan_name === str1){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })

    .filter('account',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.branch.match(str) && item.power.match(str1)){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })

    .filter('disease',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.Type.match(str) && item.CompType.match(str1)){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })

    .filter('curingDis',function () {
        return function (oldValue,str) {
            console.log(oldValue)
            let newData = [];
            for(let item of oldValue){
                if (item.disease_name.match(str)){
                    newData.push(item);
                    console.log(newData);
                }
            }
            return newData;
        }
    })

    .filter('price',function () {
        return function (oldValue,str) {
            let newData = [];
            for(let item of oldValue){
                if (item.project.match(str)){
                    newData.push(item);
                }
            }
            return newData;
        }
    })


  .filter('diseaseTotal',function () {
    return function (oldValue,str,str1) {
      let newData = [];
      for(let item of oldValue){
        if (item.facilitiesname.match(str) && item.Reporting_time.match(str1)){
          newData.push(item);
        }
      }
      return newData;
    }
  })
    .filter('journal',function () {
        return function (oldValue,str,str1) {
            let newData = [];
            for(let item of oldValue){
                if (item.ip.match(str) && item.username.match(str1)){
                    newData.push(item);
                }
            }
            return newData;
        }
    })
