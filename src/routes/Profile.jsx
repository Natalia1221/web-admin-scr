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
  const [updatemisi, setUpdatemisi] = useState();
  const [tujuan, setTujuan] = useState();
  

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [modeModal, setModeModal] = useState("");

  const [showModalMisi, setShowModalMisi] = useState(false);
  const [updateMisi, setUpdateMisi] = useState("");
  const [updateTujuan, setUpdateTujuan] = useState("");

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(false);
  
  const [showModalNew, setShowModalNew] = useState(false);
  const [addNew, setAddNew] = useState("");

  const [loading, setLoading] = useState(true);

  const getUpdatedData = async (modeModal) =>{
    const  UpdatedData= await supabase.from(`${modeModal}`).select("*").order('created_at', { ascending: true });
    if(UpdatedData){
      if(modeModal==="misi"){setMisi(UpdatedData.data)}
      if(modeModal==="tujuan"){setTujuan(UpdatedData.data)}
    }
  }

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

    setShowModalAdd(false);
  };

  const handleSaveMisi = async () => {
    if(modeModal==="misi") {
      if(updateMisi!==""){
        
        const { error } = await supabase
        .from('misi')
        .update({ misi: updateMisi.misi})
        .eq('id',  updateMisi.id)
        
        getUpdatedData(modeModal)
        setUpdateMisi("")
      }
    }

    if(modeModal=="tujuan") {
      if(updateTujuan!==""){
        
        const { error } = await supabase
        .from('tujuan')
        .update({ tujuan: updateTujuan.tujuan})
        .eq('id',  updateTujuan.id)
        
        getUpdatedData(modeModal)
        setUpdateTujuan("")
      }
    }

    setShowModalMisi(false)
  }

  const handleDelete = async () =>{
    if(idDelete){
      const { error } = await supabase
      .from(`${modeModal}`)
      .delete()
      .eq('id', idDelete)
    }
    
    getUpdatedData(modeModal) 
    setShowModalDelete(false)
  } 
  
  const handleNew = async (modeModal) =>{
    const { error } = await supabase
    .from(`${modeModal}`)
    .insert({ [`${modeModal}`]: addNew })
    getUpdatedData(modeModal) 
    setShowModalNew(false)
    setAddNew("")
  }

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

      const  dataMisi = await supabase.from("misi").select("*").order('created_at', { ascending: true });
      if (dataMisi) {
        setMisi(dataMisi.data)
        setFetchError(null);
      }

      const  dataTujuan = await supabase.from("tujuan").select("*").order('created_at', { ascending: true });
      if (dataTujuan) {
        setTujuan(dataTujuan.data)
        setFetchError(null);
      }
    };

    fetchEvent();
    
  }, []);

  return (
    <>
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
                          variant="primary"
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
                          variant="primary"
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
                          variant="primary"
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
                          {!tujuan?""
                          :tujuan.map((onetujuan, index)=>{
                            return(<li key={index}>{onetujuan.tujuan}</li>)
                          })}
                        </ol>
                        
                      </td>
                      <td>
                        <Button
                          name= "misi"
                          className="deleteButton"
                          style={{ fontFamily: "Bold" }}
                          variant="primary"
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

      {/* modal pertama */}
      <Modal
        show={showModalAdd}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalAdd(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`edit data ${modeModal}`}</Modal.Title>
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
                <Button
                variant="primary"
                className="w-10  mt-2"
                onClick={() => setShowModalNew(true)}
                >
                TAMBAH
                </Button>
                {!misi?("")
                :(
                  misi.map((one_misi,i)=>{
                    return <>
                      <div className="container-table w-100">
                        <Table  style={{ fontFamily: "Bold" }}>
                          <tr>
                            <td align="left">{`misi${i+1}`}</td>
                            <td>{one_misi.misi}</td>
                            <td className="d-flex align-items-center w-25">
                              <Button
                                name= "jumlah"
                                className="deleteButton"
                                style={{ fontFamily: "Bold" }}
                                variant="primary"
                                onClick={(v) => {
                                  setShowModalMisi(true);
                                  setUpdateMisi(one_misi);
                                }}
                              >
                                EDIT
                              </Button>
                              <Button
                                name= "jumlah"
                                className="deleteButton"
                                style={{ fontFamily: "Bold" }}
                                variant="danger"
                                onClick={(value) => {
                                  setShowModalDelete(true);
                                  setIdDelete(one_misi.id);
                                }}
                              >
                                DELETE
                              </Button>
                              </td>
                          </tr>
                        </Table>
                      </div>
                    </>

                    
                })
                )}
                
              </>
              )
              :((modeModal === "tujuan"?(
                <>
                {/* tujuan */}
                <Button
                variant="primary"
                className="w-10  mt-2"
                onClick={() => setShowModalNew(true)}
                >
                TAMBAH
                </Button>
                {!tujuan?("")
                :(
                  tujuan.map((one_tujuan,i)=>{
                    return <>
                      <div className="container-table w-100">
                        <Table bordered hover style={{ fontFamily: "Bold" }}>
                          <tr>
                            <td align="left">{`tujuan${i+1}`}</td>
                            <td>{one_tujuan.tujuan}</td>
                            <td className="w-25">
                              <Button
                                name= "jumlah"
                                className="deleteButton "
                                style={{ fontFamily: "Bold" }}
                                variant="primary"
                                onClick={(v) => {
                                  setShowModalMisi(true);
                                  setUpdateTujuan(one_tujuan);
                                }}
                              >
                                EDIT
                              </Button>
                              <Button
                                name= "jumlah"
                                className="deleteButton"
                                style={{ fontFamily: "Bold" }}
                                variant="danger"
                                onClick={(value) => {
                                  setShowModalDelete(true);
                                  setIdDelete(one_tujuan.id);
                                }}
                              >
                                DELETE
                              </Button>
                              </td>
                          </tr>
                        </Table>
                      </div>
                    </>

                    
                })
                )}
                
              </>
              )
              :(
              <></>
              )))))
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
      {/* end of modal pertama */}

      {/* modal kedua */}
      <Modal
        show={showModalMisi}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalMisi(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`edit data ${modeModal}`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Form style={{ fontFamily: "Bold" }}>
          {modeModal==="misi"?(
            <Form.Group className="d-flex align-items-center mb-2 mt-2">
              <Form.Label className="w-25">Edit Misi</Form.Label>
              <Form.Control
                className="w-100"
                as="textarea"
                rows={3}
                placeholder={updateMisi?updateMisi.misi:""}
                value={updateMisi?updateMisi.misi:""}
                onChange={(v) => {
                  setUpdateMisi((prevState) => ({
                      ...prevState,
                      misi: v.target.value,
                    }))
                  
                }
                }/>
              </Form.Group>
              
              
          )
        :(modeModal==="tujuan"?(
          <Form.Group className="d-flex align-items-center mb-2 mt-2">
              <Form.Label className="w-25">Edit Tujaun</Form.Label>
              <Form.Control
                className="w-100"
                as="textarea"
                rows={3}
                placeholder={updateTujuan?updateTujuan.tujuan:""}
                value={updateTujuan?updateTujuan.tujuan:""}
                onChange={(v) => {
                  setUpdateTujuan((prevState) => ({
                      ...prevState,
                      tujuan: v.target.value,
                    }))
                  
                }
                }/>
              </Form.Group>
        )
        :(
          <></>
        ))}
        <Button
                variant="success"
                className="w-100 mb-4 mt-2"
                onClick={() => handleSaveMisi()}
              >
                SIMPAN
        </Button>
        </Form>
        </Modal.Body>
      </Modal>
      {/* end of modal kedua */}

      {/* modal ketiga */}
      <Modal
        show={showModalDelete}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalDelete(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>Anda yakin ingin menghapus?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Button
                variant="danger"
                className="w-100 mb-4 mt-2"
                onClick={() => 
                  handleDelete()}
              >
                HAPUS
        </Button>
        </Modal.Body>
      </Modal>

      {/* modal keempat */}
      <Modal
        show={showModalNew}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalNew(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`menambah ${modeModal}`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Form style={{ fontFamily: "Bold" }}>
          <Form.Group className="d-flex align-items-center mb-2 mt-2">
            <Form.Control
              className="w-100"
              as="textarea"
              rows={3}
              placeholder={addNew!==""?addNew:""}
              value={addNew!==""?addNew:""}
              onChange={(v) => {
                setAddNew(v.target.value) 
              }
              }
              />
          </Form.Group>
          <Button
                variant="success"
                className="w-100 mb-4 mt-2"
                onClick={() => 
                  handleNew(modeModal)}
              >
                TAMBAH
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
    </>
    
  );
};

export default VisiMisi;