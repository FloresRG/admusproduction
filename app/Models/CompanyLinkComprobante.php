<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyLinkComprobante extends Model
{
    use HasFactory;

    protected $table = 'company_link_comprobante';

    protected $fillable = [
        'company_id',
        'link_id',
        'comprobante_id',
        'mes',
        'fecha'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function link()
    {
        return $this->belongsTo(Link::class);
    }

    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }
}
