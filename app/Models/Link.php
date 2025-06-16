<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    use HasFactory;

    protected $fillable = ['link', 'detalle'];

    public function companyAssociations()
    {
        return $this->hasMany(CompanyLinkComprobante::class);
    }
}
