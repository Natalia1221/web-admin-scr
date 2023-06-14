import '../assets/Profile.css';
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import supabase from "../config/supabaseClient";


import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
const VisiMisi = () => {
  const [fetchError, setFetchError] = useState(null);
  const [jumlah, setJumlah] = useState(null);
  const [visi, setVisi] = useState();
  const [misi, setMisi] = useState();
  const [tujuan, setTujuan] = useState();

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [modeModal, setModeModal] = useState("");
  
  const [loading, setLoading] = useState(true);

  const handleSaveEvent = async () => {
    if(modeModal=="jumlah") {
      const { error } = await supabase
      .from('jumlah')
      .update({ komputer: jumlah.komputer,
                luas : jumlah.luas,
                pengurus: jumlah.pengurus 
              })
      .eq('id', jumlah.id)
    }

    if(modeModal=="visi") {
      const { error } = await supabase
      .from('visi')
      .update({ visi: visi.visi})
      .eq('id',  visi.id)
    }

    if(modeModal=="misi") {
      misi.map(async (misi)=>{
        const { error } = await supabase
        .from('misi')
        .update({ misi: misi.misi})
        .eq('id',  misi.id)
      })
      
    }
    setShowModalAdd(false);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const  dataJlh = await supabase.from("jumlah").select("*");
      if (dataJlh) {
        setJumlah(dataJlh.data[0]);
        setFetchError(null);
      }

      const  dataVisi = await supabase.from("visi").select("*");
      if (dataVisi) {
        setVisi(dataVisi.data[0]);
        setFetchError(null);
      }

      const  dataMisi = await supabase.from("misi").select("*");
      if (dataMisi) {
        //  dataMisi.data.map((onemisi, index) => {
        //   !misi ? setMisi([{ misi0: onemisi }])
        //     : setMisi((prevState) => ([
        //       ...prevState,
        //       { [`misi${index}`]: onemisi },
        //     ]));

        // })
        setMisi(dataMisi.data)
        
        console.log(dataMisi.data)
        
        setFetchError(null);
      }
    };

    fetchEvent();
    misi?console.log(misi):console.log("kosong")
  }, []);





  return (
    <>
      {/* <Modals show={modalShow}/> */}
      <center>
        {!jumlah ? (
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
                      <td>{`${jumlah.komputer} Kompuer, ${jumlah.luas} luas rungan, ${jumlah.pengurus} pengurus`}</td>
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
                      <td>{visi?visi.visi:""}</td>
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
                          {!misi?""
                          :misi.map((onemisi, index)=>{
                            return(<li key={index}>{onemisi.misi}</li>)
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
                          {/* {datas.record.tujuan.map((tujuan, i)=>{
                            return(<li>{tujuan}</li>)
                          })} */}
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
                    placeholder={jumlah?jumlah.komputer:""}
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
                    placeholder={jumlah?jumlah.luas:""}
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
                    placeholder={jumlah?jumlah.pengurus:""}
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
                  className={visi?visi.visi:""}
                  placeholder=""
                  as="textarea"
                  rows={3}
                  value={visi?visi.visi:""}
                  onChange={(v) => {
                    setVisi((prevState) => ({
                        ...prevState,
                        visi: v.target.value,
                      }))
                    
                  }
                  }
                />
                </Form.Group>
              </>
              )
              :(modeModal==="misi"?(
              <>
                {/* misi */}
                
                {!misi?("")
                :(
                  misi.map((one_misi,i)=>{
                    return<>
                      <Form.Group key ={i} className="d-flex mb-2 mt-2">
                      <Form.Label className="w-25">{`misi ${i+1}`}</Form.Label>
                      <Form.Control
                        className="w-100"
                        placeholder=""
                        as="textarea"
                        rows={2}
                        value={misi[i].misi?misi[i].misi:""}
                        onChange={(v) => {
                          let newmisi = misi
                          newmisi[i].misi = v.target.value;
                          if(newmisi[i].misi){setMisi(newmisi)}
                          console.log(misi)
                        }}
                      />
                      </Form.Group>
                    </>
                    
                })
                )}
                
                
              </>
              )
              :(<>
                <>
                {/* tujuan */}
                {/* <Form.Group className="d-flex mb-2 mt-2">
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
                </Form.Group> */}
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