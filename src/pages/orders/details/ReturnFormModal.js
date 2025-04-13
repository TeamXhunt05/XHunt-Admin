import React, { useState } from 'react'
import { Input, Modal } from 'antd';

const ReturnFormModal = ({ data, status, handleStatus, updateReturnDaysForOrderItem }) => {

    const [days, setDays] = useState();



    const handleReturnDaysForItem = () => {
        let dataParam = {
            return_days:  days, 
            order_item_id: data._id
        }

        updateReturnDaysForOrderItem(dataParam)
    }

    return (

        <Modal
            title={"Update Return Policy For Order Item"}
            okText="Update Return Policy"
            visible={status}
            onCancel={handleStatus}
            onOk={handleReturnDaysForItem}
        >   

            <h6> Current Return Days for this order item is : {data.return_days} </h6>

            <Input onChange={(e) => setDays(e.target.value) } size="middle" type={"number"} placeholder="Total return days for item" />
            <br />
            
        </Modal>


    )
}

export default ReturnFormModal