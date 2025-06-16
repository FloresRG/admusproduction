<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comprobante extends Model
{
    use HasFactory;

    protected $fillable = ['comprobante', 'detalle', 'glosa', 'tipo'];

    public function companyAssociations()
    {
        return $this->hasMany(CompanyLinkComprobante::class);
    }
}
