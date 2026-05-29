<?php

namespace App\Http\Requests\User\Catalogue;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Lang;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
             'name' => 'required|string|max:255',
             'canonical' => 'required|string|unique:user_catalogues',
             'description' => 'sometimes|string',
             'publish' => 'sometimes|in:1,2',
             'permission_ids' => 'sometimes|array',
             'permission_ids.*' => 'exists:permissions,id',
        ];
    }

    public function attributes()
    {
        return [
            'name' => Lang::get('message.user_catalogue.name'),
            'canonical' => Lang::get('message.user_catalogue.canonical'),
            'description' => Lang::get('message.user_catalogue.description'),
        ];
    }

    protected function prepareForValidation()
    {
         $this->merge([
             'canonical' => Str::slug($this->input('canonical')),
         ]);
    }
}
