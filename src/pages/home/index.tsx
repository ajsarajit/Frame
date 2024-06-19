"use client"

import styles from "./home.module.css"
import { useForm,useFieldArray } from "react-hook-form"
import styled from "styled-components"

const Home  = ()=>{

    const Form = styled.form`
  display: flex;
  flex-direction: column;

  align-items: center;
  border-color: red;
`;
const FormGroup = styled.div`
   display: flex;
    background-color: rgb(221, 221, 221);
    width: 100%;
    height: auto;
    padding: 0%;
   margin: 0%;
`;

    const Input = styled.input`
    margin: 5px;
    padding-left: 5px;
    background-image: url("/searchicon.png");
    background-repeat: no-repeat;
    background-position: 1px center;
    background-size: 15px 15px;

    `;
    const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;

  &:hover {
    background-color: #0056b3;
  }
`;
    
    return (
        <Form >
        <button className={styles.button}>Add New Report</button>
        <div className={styles.body}>
            <FormGroup className={styles.nav}>
                <span className={styles.search}>
                    
                    <Input className={styles.input} type="text" placeholder="     Tag radiology test name"/>
                    <Input className={styles.input} type="text" placeholder="     Select Date"/>
                    <Input className={styles.input} type="text" placeholder="     Performing Dr."/>
                    <Input className={styles.input} type="text" placeholder="     Add diagonals"/>
                    
                </span>

                <span className={styles.operation}>
                <button><img src="bookmark.png" alt="bookmark" height="20px"/></button>
                <button><img src="dustbin.png" alt="delete" height="20px" /></button>
                
                </span>

            </FormGroup>
            <div className={styles.upload}>
                <label >
                    <img src="/upload.png" alt="upload" height="20px"/>
                <input type="file"  /> <br />
                <b>Click to upload</b> or drag and drop png, jpg or pdf |Max size:10mb
                </label>
            </div>

        </div>
        </Form>
    )
}
export default Home