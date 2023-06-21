import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import supabase from "../config/supabaseClient";
import Modal from "react-bootstrap/Modal";
const imgUrl = "https://vkrbtrcgdbdhvdspsxdd.supabase.co/storage/v1/object/public/images";

const Pengurus = () => {
  const [fetchError, setFetchError] = useState(null);
  const [pengurus, setPengurus] = useState(null);
  const [field, setField] = useState()

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(field){
      console.log(field)
      const timestamp = Date.now();
      const imageName =`pengurus/-${field.name}-${timestamp}`
      const imageLink = `${imgUrl}/${imageName}`

      const { data, error } = await supabase.storage.from("images").upload(imageName, field, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        throw error;
      }

      if(data){
        const { eror } = await supabase
            .storage
            .from('images')
            .remove([pengurus[0].link.split(`${imgUrl}/`)[1]])

        const { error } = await supabase
          .from('pengurus_img')
          .update({ link: imageLink})
          .eq('id',  pengurus[0].id)

        fetchEvent()
        setField(null)
      }
    } 
    
  }

  const handleChange = async (e) =>{
    setField(e.target.files[0]);
  }

  const fetchEvent = async () => {
    const  dataPengurus = await supabase.from("pengurus_img").select("*");
    if (dataPengurus) {
      setPengurus(dataPengurus.data);
      setFetchError(null);
    }else{
      console.log(fetchError)
    }
  };

  useEffect(() => {
    

    fetchEvent()
  }, []);
  return (
    <>
    <center>
      {!pengurus?(
        <Card className="w-25 mt-4 mb-4">
          <Card.Body>Loading ...</Card.Body>
        </Card>
      )
      :(
        <div className="container-table bg-white">
          <div className="form-group" lign="left" >
            <form onSubmit={handleSubmit}>
            <input type="file" className="form-control" name="image" accept="image/*"  onChange={handleChange}/>
            <Button 
                  type="submit"
                  className="addButton mt-1 mb-2 w-25"
                  style={{ fontFamily: "Bold" }}
                  variant="success"
                >
                  UBAH GAMBAR
            </Button>
            </form>
          </div>
          <Table className="mt-5" bordered hover style={{ fontFamily: "Bold" }}>
            <tbody>
              <tr className="header" style={{ fontFamily: "Bold" }}>
                <th>Gambar</th>
              </tr>
              {
                pengurus.link?(<></>)
                :(
                  <tr>
                    <td>
                      <img className="w-25 h-25 me-2" src={pengurus[0].link}/>
                    </td>
                  </tr>
                )
              }  
            </tbody>
          </Table>
        </div>
      )}
    </center>
    </>
  );
};

export default Pengurus;