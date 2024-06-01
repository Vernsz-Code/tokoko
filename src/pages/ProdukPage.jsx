import React from 'react'
import { useParams } from 'react-router-dom';

function ProdukPage() {
    const { id } = useParams();
    console.log(id)
  return (
    <div>ProdukPage</div>
  )
}

export default ProdukPage