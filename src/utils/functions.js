import React from "react";
import { Descriptions } from 'antd';
import moment from "moment";

export const getTitleImage = (name) => {
    let nameTokens = name.split(' ');
    nameTokens = nameTokens.map((nameToken) => {
        return nameToken.substr(0, 1).toUpperCase() + nameToken.substr(1);
    })
    return nameTokens.join(' ');
}


export const convertToFormData = (val) => {
    const formData = new FormData();
    for (let i in val) {
        formData.append(i, val[i])
    }

    return formData;
}

export const isEmpty = (str) => ["", null, undefined].includes(str);



export const activeInactiveStatus = (data) => {
    if (data.status == true) {
        return <h5><span class="badge badge-success">Active</span></h5>
    } else {
        return <h5><span class="badge badge-danger">Inactive</span></h5>
    }
}


export default function getObjectIteratedValues(objectVal) {
    const detailValuesArr = [];
    if (!isEmpty(objectVal) && Object.keys(objectVal).length > 0) {
        for (let key in objectVal) {
            let value = objectVal[key];
            key = key.replaceAll('_', " ");
            if (typeof value === "string") {
                detailValuesArr.push(<Descriptions.Item label={key}>{value}</Descriptions.Item>)
            }
        }
    }

    return detailValuesArr;
}


export const isValidURL = (string) => {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

export const getLocalStorageUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
};


export const antdIsValidString = (fieldName, maxLength = 50, isNumber) => {

    const validation = [
        { required: true, message: 'This field is required!' },
        { max: maxLength, message: `${fieldName} must not be greater than ${maxLength} characters.` },
        { whitespace: true, message: "blank spaces are not allowed" },
    ]

    if (isNumber) {
        validation.push({
            required: true,
            message: "A value must be entered",
            pattern: new RegExp(/^[0-9]+$/)
        })
    }

    return validation
};


export const trimObjValues = (myObject) => {

    for (var key in myObject) {
        if (typeof myObject[key] === "string") {
            myObject[key] = myObject[key].trim();
        }
    }

    return myObject;
}


export const momentDateFormat = (date) => {
    return moment(date).format("DD-MM-YYYY hh:mm a")
}


export const getUploadsImages = (data) => {
    let extension = data[0]?.split("/")[1].split(";")[0];
    return Object.values(data).map((image, i) => {
        if (image.startsWith(process.env.REACT_APP_ApiUrl)) {
            return image;
        } else {
            return dataURLtoFile(image, 'image_' + i + '.' + extension);
        }
    })
}



export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
