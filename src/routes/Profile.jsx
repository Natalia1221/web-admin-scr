import '../assets/Profile.css';
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modals from "../component/Modals"


import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
const VisiMisi = () => {
  const [datas, setDatas] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [modeModal, setModeModal] = useState("");
  const [jumlah, setJumlah] = useState({
    pengurus :0,
    komputer :0,
    luas :"",
  });
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState([]);
  const [tujuan, setTujuan] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSaveEvent = () => {
    // let req = new XMLHttpRequest();

    // req.onreadystatechange = () => {
    // if (req.readyState == XMLHttpRequest.DONE) {
    //   console.log(req.responseText);
    //   }
    // };

    // req.open("PUT", "https://api.jsonbin.io/v3/b/642edc16c0e7653a059f0111", true);
    // req.setRequestHeader("Content-Type", "application/json");
    // req.setRequestHeader("X-Master-Key", "$2b$10$y0gK/I3iIf6ZpQdNy1jcIOGz244q1yRdbBRNDws4fl5TLU7mSS6wi");
    

    // if(modeModal==="jumlah"){
    //   req.send(`{"jumlah": ${JSON.stringify(jumlah)}}`);
    // }
    
    
   
    // console.log(jumlah)
    // console.log(visi)
    // console.log(misi)
    // console.log(tujuan)

    // setJumlah({
    //   pengurus :0,
    //   komputer :0,
    //   luas :"",
    // })
    // setVisi("");
    // setMisi([]);
    // setTujuan([]);
    
    setShowModalAdd(false);
  };

  useEffect(() => {

    fetch("https://api.jsonbin.io/v3/b/642edc16c0e7653a059f0111", {
      headers: {
        "X-ACCESS-KEY": "$2b$10$yySJNemZxy5owr6fRQU62Ovqd/PLHW7.kg3KToeIMK5tCRqX398X."
      }
    })
    .then((response) => response.json())
    .then((json) => setDatas(json))
    .then(()=> datas)
    .then((data)=>{
              if(data.record){
                setJumlah({pengurus:data.record.jumlah.pengurus,
                  komputer : data.record.jumlah.komputer,
                  luas: data.record.jumlah.luas,
                  
                })

                setVisi(data.record.visi);
                setMisi(data.record.misi);
                setTujuan(data.record.tujuan);
              }
              

              // datas.record?(datas.record.misi.map((misi)=>{
              //   setMisi((prevState) => ([
              //     ...prevState,
              //     misi,
              //   ]))
              // }))
              // :(setMisi([]))

              // datas.record?(datas.record.tujuan.map((tujuan)=>{
              //   setTujuan((prevState) => ([
              //     ...prevState,
              //     tujuan,
              //   ]))
              // }))
              // :(setTujuan([]))
              
    })
  }, []);




  return (
    <>
      {/* <Modals show={modalShow}/> */}
      <center>
        {!datas.record ? (
          <Card className="w-25 mt-4 mb-4">
            <Card.Body>Tidak ada data</Card.Body>
          </Card>
        ) : (
          <div className="container-table">
            <Table bordered hover style={{ fontFamily: "Bold" }}>
              <tbody>
                <tr className="header" style={{ fontFamily: "Bold" }}>
                  <th>NAMA</th>
                  <th>ISI</th>
                  <th>AKSI</th>
                </tr>
                { <>
                    <tr>
                      <td align="left">Jumlah</td>
                      <td>{`${datas.record.jumlah.komputer} Kompuer, ${datas.record.jumlah.luas} luas rungan, ${datas.record.jumlah.pengurus} pengurus`}</td>
                      <td>
                        <Button
                          name= "jumlah"
                          className="deleteButton"
                          style={{ fontFamily: "Bold" }}
                          variant="danger"
                          onClick={(value) => {
                            setShowModalAdd(true);
                            setModeModal("jumlah");
                          }}
                        >
                          EDIT
                        </Button>{" "}
                      </td>
                    </tr>

                    <tr>
                      <td align="left">Visi</td>
                      <td>{`${datas.record.visi} `}</td>
                      <td>
                        <Button
                          name= "visi"
                          className="deleteButton"
                          style={{ fontFamily: "Bold" }}
                          variant="danger"
                          onClick={() => {
                            setShowModalAdd(true);
                            setModeModal("visi");
                          }}
                        >
                          EDIT
                        </Button>{" "}
                      </td>
                    </tr>

                    <tr>
                      <td align="left">Misi</td>
                      <td>
                        <ol>
                          {datas.record.misi.map((misi, i)=>{
                            return(<li key={i}>{misi}</li>)
                          })}
                        </ol>
                        
                      </td>
                      <td>
                        <Button
                          name= "misi"
                          className="deleteButton"
                          style={{ fontFamily: "Bold" }}
                          variant="danger"
                          onClick={() => {
                            setShowModalAdd(true);
                            setModeModal("misi");
                          }}
                        >
                          EDIT
                        </Button>{" "}
                      </td>
                    </tr>
                    
                    <tr>
                      <td align="left">Tujuan</td>
                      <td>
                        <ol>
                          {datas.record.tujuan.map((tujuan, i)=>{
                            return(<li>{tujuan}</li>)
                          })}
                        </ol>
                        
                      </td>
                      <td>
                        <Button
                          name= "misi"
                          className="deleteButton"
                          style={{ fontFamily: "Bold" }}
                          variant="danger"
                          onClick={() => {
                            setShowModalAdd(true);
                            setModeModal("tujuan");
                          }}
                        >
                          EDIT
                        </Button>{" "}
                      </td>
                    </tr>
                  </> 
                }
              </tbody>
            </Table>
          </div>
        )}
      </center>

      {/* modal add */}
      <Modal
        show={showModalAdd}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalAdd(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>EDIT DATA JUMLAH</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form style={{ fontFamily: "Bold" }}>
              { modeModal==="jumlah"?( 
              <>
                {/* komputer */}
                <Form.Group className="d-flex align-items-center mb-2 mt-2">
                  <Form.Label className="w-25">Komputer</Form.Label>
                  <Form.Control
                    className="w-100"
                    placeholder={datas.record?datas.record.jumlah.komputer:""}
                    value={jumlah.komputer}
                    onChange={(v) => {
                      setJumlah((prevState) => ({
                          ...prevState,
                          komputer: v.target.value,
                        }))
                      
                    }
                    }
                  />
                </Form.Group>
                {/* luas */}
                <Form.Group className="d-flex align-items-center mb-2 mt-2">
                  <Form.Label className="w-25">Luas</Form.Label>
                  <Form.Control
                    className="w-100"
                    placeholder={datas.record?datas.record.jumlah.luas:""}
                    value={jumlah.luas}
                    onChange={(v) => {
                      setJumlah((prevState) => ({
                          ...prevState,
                          luas: v.target.value,
                        }))
                      
                    }
                    }
                  />
                </Form.Group>
                {/* pengurus*/}
                <Form.Group className="d-flex align-items-center mb-2 mt-2">
                  <Form.Label className="w-25">Pengurus</Form.Label>
                  <Form.Control
                    className="w-100"
                    placeholder={datas.record?datas.record.jumlah.pengurus:""}
                    value={jumlah.pengurus}
                    onChange={(v) => {
                      setJumlah((prevState) => ({
                          ...prevState,
                          pengurus: v.target.value,
                        }))
                      
                    }
                    }
                  />
                </Form.Group>
              </>
              )
              :( modeModal==="visi"?(
              <>
                {/* visi */}
                <Form.Group className="d-flex mb-2 mt-2">
                <Form.Label className="w-25">visi</Form.Label>
                <Form.Control
                  className="w-100"
                  placeholder=""
                  as="textarea"
                  rows={3}
                  value={visi}
                  onChange={(v) => setVisi(v.target.value)}
                />
                </Form.Group>
              </>
              )
              :(modeModal==="misi"?(
              <>
                {/* misi */}
                <Form.Group className="d-flex mb-2 mt-2">
                <Form.Label className="w-25">misi</Form.Label>
                <Form.Control
                  className="w-100"
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={
                    misi.map((misi, i)=>{
                    return(`${i+1} ${misi} \n`)
                    })}
                  onChange={(v) => {
                    const arraymisi = v.target.value.split("\n")
                    arraymisi.map((misi, i)=>{
                      arraymisi[i]=misi.slice(2)
                    })
                    setMisi(arraymisi)
                    console.log(arraymisi)
                  }}
                />
                </Form.Group>
              </>
              )
              :(<>
                <>
                {/* tujuan */}
                <Form.Group className="d-flex mb-2 mt-2">
                <Form.Label className="w-25">tujuan</Form.Label>
                <Form.Control
                  className="w-100"
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={
                    tujuan.map((tujuan, i)=>{
                    return(`${i+1} ${tujuan} \n`)
                    })}
                  onChange={(v) => setTujuan(v.target.value)}
                />
                </Form.Group>
              </>
              </>)))
              }

              
              
              
              <Button
                variant="success"
                className="w-100 mb-4 mt-2"
                onClick={() => handleSaveEvent()}
              >
                SIMPAN
              </Button>{" "}
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
    
  );
};

export default VisiMisi;