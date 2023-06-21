/* eslint-disable array-callback-return */
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



const Kegiatan = () => {
  const [fetchError, setFetchError] = useState(null);
  const [bidang, setBidang] = useState(null);
  const [kegiatan, setKegiatan] = useState();
  
  const [showModalKegiatan, setShowModalKegiatan] = useState(false);
  const [updateKegiatan, setUpdateKegiatan] = useState("");

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(false);
  
  const [showModalNew, setShowModalNew] = useState(false);
  const [addNew, setAddNew] = useState("");

  const getUpdatedData = async (modeModal) =>{
    const  UpdatedData= await supabase.from(`${modeModal}`).select("*").order('name', { ascending: true });
    if(UpdatedData){
      if(modeModal==="kegiatan"){setKegiatan(UpdatedData.data)}
      if(modeModal==="bidang"){setBidang(UpdatedData.data)}
    }
  }

  const handleSaveEvent = async () =>{
    const { error } = await supabase
      .from('kegiatan')
      .update({ name : updateKegiatan.name,
                desc: updateKegiatan.desc,
              })
      .eq('id', updateKegiatan.id)
    getUpdatedData("kegiatan")
    setShowModalKegiatan(false)
  }

  const handleNew = async () =>{
    if(addNew.name!==""){
      const { error } = await supabase
      .from(`kegiatan`)
      .insert(addNew)
      getUpdatedData("kegiatan")
    }
    setShowModalNew(false)
  }

  const handleDelete = async () =>{
    if(idDelete){
      const { error } = await supabase
      .from(`kegiatan`)
      .delete()
      .eq('id', idDelete)
    }
    
    getUpdatedData("kegiatan") 
    setShowModalDelete(false)
  } 

  useEffect(() => {
    const fetchEvent = async () => {
      const  dataBidang = await supabase.from("bidang").select("*").order('created_at', { ascending: true });
      if (dataBidang) {
        setBidang(dataBidang.data);
        setFetchError(null);
      }

      const  dataKegiatan = await supabase.from("kegiatan").select("*").order('name', { ascending: true });
      if (dataKegiatan) {
        setKegiatan(dataKegiatan.data);
        setFetchError(null);
      }else{
        console.log(fetchError)
      }
    };

    fetchEvent();
    
  }, []);

  return (
  <>
  <center >
    {!bidang?(
      <Card className="w-25 mt-4 mb-4">
        <Card.Body>Loading ...</Card.Body>
      </Card>
    )
    :(
      bidang.map((one_bidang) => {
        return <div className="container-table bg-white">
            <Table className="mt-5" bordered hover style={{ fontFamily: "Bold" }}>
              <Button 
                className="addButton mt-5 mb-2 w-100"
                style={{ fontFamily: "Bold" }}
                variant="success"
                onClick={(v) => {
                  setAddNew({
                    name : "",
                    desc: "",
                    id_bidang:one_bidang.id
                  })
                  setShowModalNew(true);
                }}
              >
                TAMBAH
              </Button>
              <tbody>
                <tr className="header "   style={{ fontWeight: "Bold" }}>
                  <td colSpan="3" className='bg-light'>{`${one_bidang.name}`}</td>
                </tr>
                <tr className="header" style={{ fontFamily: "Bold" }}>
                  <th>Kegiatan</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>

                {
                  kegiatan?(
                    kegiatan.map((one_kegiatan) => {
                      if(one_kegiatan.id_bidang===one_bidang.id){
                        return <tr>
                                <td align="left">{one_kegiatan.name}</td>
                                <td align="left">{one_kegiatan.desc}</td>
                                <td align="center">
                                  <Button
                                    name= "kegiatan"
                                    className="deleteButton ms-2 me-2"
                                    style={{ fontFamily: "Bold" }}
                                    variant="primary"
                                    onClick={(v) => {
                                      setUpdateKegiatan(one_kegiatan);
                                      setShowModalKegiatan(true);
                                    }}
                                  >
                                    EDIT
                                  </Button>
                                  <Button
                                    name= "kegitan"
                                    className="deleteButton ms-2 me-2"
                                    style={{ fontFamily: "Bold" }}
                                    variant="danger"
                                    onClick={(value) => {
                                      setShowModalDelete(true);
                                      setIdDelete(one_kegiatan.id);
                                    }}
                                  >
                                    DELETE
                                  </Button>
                                </td>
                              </tr>
                      }
                      
                    }
                    )
                    
                  )
                  :(<></>)
                }
              </tbody>
            </Table>
          </div>
      })
      )
    }
  
  </center>
  {/* {modal pertama} */}
  <Modal 
    show={showModalKegiatan}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
  <Modal.Header closeButton onClick={() => setShowModalKegiatan(false)}></Modal.Header>
  <Modal.Body>
    <Form.Group className=" align-items-center mb-2 mt-2">
      <Form.Control
        className="w-100 mt-2 mb-4"
        placeholder={""}
        value={updateKegiatan.name}
        onChange={(v) => {
          setUpdateKegiatan((prevState) => ({
              ...prevState,
              name: v.target.value,
            }))
          
        }
        }
       />
       <Form.Control
        className="w-100"
        placeholder={""}
        as="textarea"
        rows={3}
        value={updateKegiatan.desc}
        onChange={(v) => {
          setUpdateKegiatan((prevState) => ({
              ...prevState,
              desc: v.target.value,
            }))
          
        }
        }
       />
       <Button
          variant="success"
          className="w-100 mb-4 mt-2"
          onClick={() => handleSaveEvent()}
        >
                SIMPAN
       </Button>
     </Form.Group>
  </Modal.Body>
  </Modal>

  {/* {modal delete} */}
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

  {/* modal tambah */}
  <Modal
        show={showModalNew}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalNew(false)}>
          <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`menambah kegiatan`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Form style={{ fontFamily: "Bold" }}>
          <Form.Group className="d-flex align-items-center mb-2 mt-2">
            <Form.Label className="w-25">Nama</Form.Label>
            <Form.Control
              className="w-100"
              placeholder={addNew.name!==""?addNew.name:""}
              value={addNew.name!==""?addNew.name:""}
              onChange={(v) => {
                setAddNew((prevState) => ({
                  ...prevState,
                  name: v.target.value,
                }))
              }
              }
              />
          </Form.Group>
          <Form.Group className="d-flex align-items-center mb-2 mt-2">
            <Form.Label className="w-25">Deskripsi</Form.Label>
            <Form.Control
              className="w-100"
              as="textarea"
              rows={4}
              placeholder={addNew.desc!==""?addNew.desc:""}
              value={addNew.desc!==""?addNew.desc:""}
              onChange={(v) => {
                setAddNew((prevState) => ({
                  ...prevState,
                  desc: v.target.value,
                }))
              }
              }
              />
          </Form.Group>
          <Button
                variant="success"
                className="w-100 mb-4 mt-2"
                onClick={() => 
                  handleNew()}
                >
                TAMBAH
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
  </>
  
  );

};

export default Kegiatan;