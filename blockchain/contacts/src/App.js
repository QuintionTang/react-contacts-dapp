import { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./config";

function App() {
    const [account, setAccount] = useState();
    const [contactList, setContactList] = useState();
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        async function load() {
            const web3 = new Web3(
                Web3.givenProvider || "http://localhost:7545"
            );
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);
            // 使用ABI和地址实例化智能合约。
            const contactListByContract = new web3.eth.Contract(
                CONTRACT_ABI,
                CONTRACT_ADDRESS
            );
            // 将联系人列表设置为状态变量。
            setContactList(contactListByContract);
            // 得到迭代的联系人总数
            const counter = await contactListByContract.methods.count().call();
            // 遍历计数器的时间量
            for (var i = 1; i <= counter; i++) {
                // 调用 contacts 方法从智能合约中获取特定的联系人
                const contact = await contactListByContract.methods
                    .contacts(i)
                    .call();
                // 添加最近获取的联系状态变量。
                setContacts((contacts) => [...contacts, contact]);
            }
        }

        load();
    }, []);

    return (
        <div>
            当前账号：<code>{account}</code>
            <h1>联系人列表</h1>
            <ul>
                {Object.keys(contacts).map((contact, index) => (
                    <li key={`${contacts[index].name}-${index}`}>
                        <h4>{contacts[index].name}</h4>
                        <span>
                            <b>手机号码： </b>
                            {contacts[index].phone}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
