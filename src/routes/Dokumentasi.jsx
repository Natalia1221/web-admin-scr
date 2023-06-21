/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import supabase from "../config/supabaseClient";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
const imgUrl = "https://vkrbtrcgdbdhvdspsxdd.supabase.co/storage/v1/object/public/images";

function Dokumentasi() {
  
  const [fetchError, setFetchError] = useState(null);
  const [dokumentasi, setDokumentasi] = useState(null);

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [updateDokumentasi, setUpdateDokumentasi] = useState("");
  const [idDelete, setIdDelete] = useState({
    id:"",
    type:""
  });
  const [field, setField] = useState()

  const handleChange = (e) => {
    setField(e.target.files[0]);
  };

  const handleAddImage = async(e) =>{
    e.preventDefault();
    if(field){
      const timestamp = Date.now();
      const imageName =`dokumentasi/-${field.name}-${timestamp}`
      const imageLink = `${imgUrl}/${imageName}`

      const { data, error } = await supabase.storage.from("images").upload(imageName, field, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        throw error;
      }
      if(updateDokumentasi.image.length===0){
        setUpdateDokumentasi((prevState) => ({
          ...prevState,
          image:imageLink
        }))
        
      }else{
        setUpdateDokumentasi((prevState) => ({
          ...prevState,
          image:`${updateDokumentasi.image}, ${imageLink}`
        }))
      }
    }
  }

  const handleSubmit = async (mode) =>{
    if(mode==="add"){
      const { error } = await supabase
      .from(`dokumentasi`)
      .insert({ name: updateDokumentasi.name,
                image: "" })

      if(error){
        throw error
      }
      setShowModalAdd(false)
    }

    if(mode==="edit"){
      const { error } = await supabase
        .from('dokumentasi')
        .update({ name: updateDokumentasi.name,
                  image: updateDokumentasi.image})
        .eq('id',  updateDokumentasi.id)
        setShowModalEdit(false)
    }
    
    fetchEvent()
  }

  const handleCancle = async () => {
    if(updateDokumentasi.image.length>0){
      updateDokumentasi.image.split(",").map(async (one_image)=>{
        if(one_image){
          const { data, error } = await supabase
          .storage
          .from('images')
          .remove([one_image.split(`${imgUrl}/`)[1]])
        }
        
      })
      
    }
    
    setField(null)
    setShowModalEdit(false)
  }

  const handleDelete = async () =>{
      if(idDelete.type === "kegiatan"){
        const { error } = await supabase
        .from(`dokumentasi`)
        .delete()
        .eq('id', idDelete.id)

        setIdDelete({
          id:"",
          type:""
        })
      }

      if(idDelete.type === "image"){
        console.log(idDelete.id)
        const { data, error } = await supabase
        .storage
        .from('images')
        .remove([idDelete.id.split(`${imgUrl}/`)[1]])

        const mewImageArray = updateDokumentasi.image.split(",").filter((one_image)=>{return one_image !== idDelete.id})
        
        if(mewImageArray){
          setUpdateDokumentasi((prevState) => ({
            ...prevState,
            image:mewImageArray.join(", ")
          }))
  
          const { eror } = await supabase
          .from('dokumentasi')
          .update({ image: mewImageArray.join(", ")})
          .eq('id',  updateDokumentasi.id)
        }
        setIdDelete({
          id:"",
          type:""
        })
      }
    
    fetchEvent() 
    setShowModalDelete(false)
  }

  const fetchEvent = async () => {
    const  dataDokumentasi = await supabase.from("dokumentasi").select("*").order('name', { ascending: true });
    if (dataDokumentasi) {
      setDokumentasi(dataDokumentasi.data);
      setFetchError(null);
    }else{
      console.log(fetchError)
    }
  };

  useEffect(() => {
    fetchEvent();
    
  }, []);
  return (
    <>
      <center>
        {!dokumentasi?(
          <Card className="w-25 mt-4 mb-4">
            <Card.Body>Loading ...</Card.Body>
          </Card>
        )
      :(
        <div className="container-table bg-white">
        <Table className="mt-5" bordered hover style={{ fontFamily: "Bold" }}>
          <Button 
                className="addButton mt-5 mb-2 w-100"
                style={{ fontFamily: "Bold" }}
                variant="success"
                onClick={(v) => {
                  setUpdateDokumentasi((prevState) => ({
                    ...prevState,
                    name:"",
                    image:""
                  }))
                  setShowModalAdd(true)
                }}
              >
                +KEGIATAN
          </Button>
          <tbody>
            <tr className="header" style={{ fontFamily: "Bold" }}>
                  <th>Kegiatan</th>
                  <th>Dokumentasi</th>
                  <th>Aksi</th>
            </tr>  
          
          {
            dokumentasi.map((one_dokumentasi)=>{
              const imageArray = one_dokumentasi.image.split(",")
              return <tr>
                  <td align="left">{one_dokumentasi.name}</td>
                  <td>
                    {imageArray.map((one_image, index)=>{
                      if(one_image){
                        return <img key={index} className="w-25 h-25 me-2" src={one_image}/>
                      }
                    })}
                  </td>
                  <td align="center">
                    <Button
                      name= "kegiatan"
                      className="deleteButton ms-0 me-0"
                      style={{ fontFamily: "Bold" }}
                      variant="primary"
                      onClick={(v) => {
                        setUpdateDokumentasi(one_dokumentasi);
                        setShowModalEdit(true);
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
                        setIdDelete({
                          id: one_dokumentasi.id,
                          type:"kegiatan"
                        });
                        setShowModalDelete(true);
                      }}
                    >
                      DELETE
                    </Button>
                  </td>
                  
              </tr>
            })
          }
          </tbody>
        </Table>
        </div>
      )}
      </center>
      
      {/* {Modal Add Documentasi} */}
      <Modal 
        show={showModalAdd}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      <Modal.Header closeButton onClick={() => setShowModalAdd(false)}>
      <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`Tambah Kegiatan`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          className="w-100 mt-4 mb-2"
          placeholder={""}
          value={updateDokumentasi?updateDokumentasi.name:""}
          onChange={(v) => {
            setUpdateDokumentasi((prevState) => ({
                ...prevState,
                name: v.target.value,
              }))
            
          }
          }
        />
        <Button
            variant="success"
            className="w-100 mb-4 mt-0"
            onClick={() => handleSubmit("add")}
          >
            SIMPAN
        </Button>
      </Modal.Body>
      </Modal>

      {/* {Modal Edit Dokumentasi} */}
      <Modal 
        show={showModalEdit}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      <Modal.Header closeButton onClick={handleCancle}>
      <Modal.Title id="contained-modal-title-vcenter" className="title-addevent" style={{ fontFamily: "Bold" }}>{`Tambah Kegiatan`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          className="w-100 mt-4 mb-2"
          placeholder={""}
          value={updateDokumentasi?updateDokumentasi.name:""}
          onChange={(v) => {
            setUpdateDokumentasi((prevState) => ({
                ...prevState,
                name: v.target.value,
              }))
            
          }
          }
        />
        <div className="form-group">
          <form onSubmit={handleAddImage}>
          <input type="file" className="form-control" name="image" accept="image/*"  onChange={handleChange}/>
          <Button 
                type="submit"
                className="addButton mt-1 mb-2 w-100"
                style={{ fontFamily: "Bold" }}
                variant="success"
              >
                TAMBAH GAMBAR
          </Button>
          </form>
        </div>
        <Table className="mt-5" bordered hover style={{ fontFamily: "Bold" }}>
          <tbody>
            <tr className="header" style={{ fontFamily: "Bold" }}>
              <th>Dokumentasi</th>
              <th>Aksi</th>
            </tr>
            {!updateDokumentasi.image?(<></>)
            :(
              <>
                {
                  updateDokumentasi.image.split(",").map((one_image, index)=>{
                    if(one_image){
                      return <tr>
                                <td>
                                  <img key={index} className="w-25 h-25 me-2" src={one_image}/>
                                </td>
                                <td>
                                  <Button
                                  name= "kegitan"
                                  className="deleteButton ms-2 me-2"
                                  style={{ fontFamily: "Bold" }}
                                  variant="danger"
                                  onClick={(value) => {
                                    setShowModalDelete(true);
                                    setIdDelete({
                                      id: one_image,
                                      type:"image"
                                    });
                                  }}
                                >
                                  DELETE
                                </Button>
                                </td>
                              </tr>
                    }
                    
                  })
                }
              </>
            )

            }
          </tbody>
        </Table>
        <Button
            variant="success"
            className="w-100 mb-4 mt-0"
            onClick={() => handleSubmit("edit")}
          >
            SIMPAN
        </Button>
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
    </>
  );
}

export default Dokumentasi;
