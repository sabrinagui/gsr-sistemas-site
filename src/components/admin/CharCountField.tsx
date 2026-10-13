'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextareaFieldClientProps, TextFieldClientProps } from 'payload'
import React from 'react'

/**
 * Contador visual para metaTitle e metaDescription.
 *
 * Decisão da FASE 2: alerta, nunca bloqueia. Passar da faixa recomendada é uma
 * escolha editorial legítima — títulos bons às vezes são longos. O campo informa
 * e sai do caminho.
 */

type Range = { min: number; max: number }

const Counter: React.FC<{ length: number; range: Range; hint: string }> = ({
  length,
  range,
  hint,
}) => {
  const empty = length === 0
  const withinRange = length >= range.min && length <= range.max
  const color = empty ? 'var(--theme-elevation-400)' : withinRange ? '#128a45' : '#b25000'

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.4rem',
        alignItems: 'baseline',
        marginTop: '0.35rem',
        fontSize: '0.7rem',
        color: 'var(--theme-elevation-500)',
      }}
    >
      <strong style={{ color, fontVariantNumeric: 'tabular-nums' }}>{length}</strong>
      <span>
        / {range.min}–{range.max} recomendados
      </span>
      {empty ? <span style={{ opacity: 0.85 }}>· {hint}</span> : null}
    </div>
  )
}

export const MetaTitleField: React.FC<TextFieldClientProps> = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const current = value ?? ''

  return (
    <div className="field-type text">
      <FieldLabel label={field?.label} path={path} />
      <input
        id={`field-${path.replace(/\./g, '__')}`}
        type="text"
        value={current}
        onChange={(e) => setValue(e.target.value)}
        className="field-type__input"
        style={{ width: '100%' }}
      />
      <Counter
        length={current.length}
        range={{ min: 50, max: 60 }}
        hint="vazio: gerado a partir do título"
      />
      {showError && errorMessage ? (
        <div className="field-error" style={{ marginTop: '0.25rem' }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}

export const MetaDescriptionField: React.FC<TextareaFieldClientProps> = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const current = value ?? ''

  return (
    <div className="field-type textarea">
      <FieldLabel label={field?.label} path={path} />
      <textarea
        id={`field-${path.replace(/\./g, '__')}`}
        value={current}
        rows={3}
        onChange={(e) => setValue(e.target.value)}
        className="field-type__input"
        style={{ width: '100%' }}
      />
      <Counter
        length={current.length}
        range={{ min: 140, max: 160 }}
        hint="vazio: usa o resumo do conteúdo"
      />
      {showError && errorMessage ? (
        <div className="field-error" style={{ marginTop: '0.25rem' }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
